"""Streamlit entry point for the Modernization AI Lab consulting engagement."""

from datetime import datetime
from html import escape
from pathlib import Path
import sys


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

import streamlit as st
from dotenv import load_dotenv

from engine.agency import (
    agent_timeline,
    build_agent_operations,
    executive_delivery_chain,
    manager_timeline,
)
from engine.data_loader import DataLoadError
from engine.workflow import (
    apply_budget_reduction,
    clear_assessment,
    clear_engineering,
    clear_intake,
    clear_replan,
    complete_replan_request,
    download_package,
    initialize_agency_state,
    load_agency_context,
    load_demo_engagement,
    original_plan,
    portfolio_summary,
    recommendation_for_assessment,
    request_replan,
    run_assessment,
    run_engineering,
    run_replan,
    selected_candidate,
    store_assessment,
    store_engineering,
    store_intake,
    store_replan,
    workflow_stage,
)


ROOT_DIR = REPOSITORY_ROOT
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
ASSESSMENT_OUTPUT_DIR = ROOT_DIR / "generated_packages" / "assessments"
IMPLEMENTATION_OUTPUT_DIR = ROOT_DIR / "generated_packages" / "implementation"
REPLAN_OUTPUT_DIR = ROOT_DIR / "generated_packages" / "replans"


def request_agency_replan() -> None:
    request_replan(st.session_state)


def apply_thirty_percent_reduction() -> None:
    apply_budget_reduction(st.session_state, reduction_percent=30.0)


def render_agent_cards(operations) -> None:
    icons = ["◆", "◈", "◇", "◉", "⬡", "✓"]
    columns = st.columns(3)
    for index, (_, agent) in enumerate(operations.iterrows()):
        status_class = "status-active" if agent["Current Status"] == "Directing" else "status-ready"
        with columns[index % 3]:
            st.markdown(
                f"""
                <div class="agent-card">
                    <div class="agent-card-top">
                        <span class="agent-icon">{icons[index]}</span>
                        <span class="agent-status {status_class}">{escape(str(agent['Current Status']))}</span>
                    </div>
                    <div class="agent-name">{escape(str(agent['Agent']))}</div>
                    <div class="agent-role">{escape(str(agent['Role']))}</div>
                    <div class="agent-task">{escape(str(agent['Task']))}</div>
                    <div class="agent-meta">
                        <span>Confidence <strong>{escape(str(agent['Confidence']))}</strong></span>
                        <span>{escape(str(agent['Duration']))}</span>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def render_timeline(events) -> None:
    timeline_parts = ['<div class="agency-timeline">']
    for _, event in events.iterrows():
        timeline_parts.append(
            f'<div class="timeline-event"><div class="timeline-marker"></div>'
            f'<div class="timeline-time">{escape(str(event["Time"]))}</div>'
            f'<div class="timeline-copy"><strong>{escape(str(event["Agent"]))}</strong>'
            f'<span>{escape(str(event["Event"]))} · {escape(str(event["Result"]))}</span>'
            f'</div></div>'
        )
    timeline_parts.append("</div>")
    st.markdown("".join(timeline_parts), unsafe_allow_html=True)


def render_deliverable_cards(deliverables) -> None:
    icons = ["✦", "◎", "▣", "◒", "✓"]
    columns = st.columns(5)
    for index, (_, deliverable) in enumerate(deliverables.iterrows()):
        with columns[index]:
            st.markdown(
                f"""
                <div class="deliverable-card">
                    <div class="deliverable-icon">{icons[index]}</div>
                    <div class="deliverable-stage">{escape(str(deliverable['Stage']))}</div>
                    <div class="deliverable-status">{escape(str(deliverable['Status']))}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

load_dotenv(ROOT_DIR / ".env")

st.set_page_config(page_title="Modernization AI Lab", page_icon="🏭", layout="wide")

st.markdown(
    """
    <style>
        :root {
            --ink: #15233b;
            --muted: #61708a;
            --navy: #0b1f3a;
            --blue: #2563eb;
            --teal: #0f9f8f;
            --purple: #7057d9;
            --surface: #f6f8fc;
            --line: #dfe6f1;
        }
        .stApp { background: linear-gradient(180deg, #f8faff 0%, #ffffff 34rem); color: var(--ink); }
        .block-container { max-width: 1500px; padding-top: 2rem; padding-bottom: 5rem; }
        h1, h2, h3 { color: var(--navy); letter-spacing: -0.02em; }
        h2 { margin-top: 2.5rem !important; }
        [data-testid="stMetric"] {
            background: rgba(255,255,255,.9); border: 1px solid var(--line);
            border-radius: 14px; padding: 1rem 1.1rem; box-shadow: 0 8px 24px rgba(26,54,93,.06);
        }
        [data-testid="stDataFrame"] { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
        [data-testid="stStatusWidget"], [data-testid="stAlert"] { border-radius: 14px; }
        .stButton > button, .stDownloadButton > button { border-radius: 10px; font-weight: 650; }
        .hero-panel {
            background: linear-gradient(125deg, #0b1f3a 0%, #153f71 58%, #0f766e 120%);
            border-radius: 22px; padding: 2.1rem 2.3rem; color: white;
            box-shadow: 0 20px 50px rgba(11,31,58,.18); margin-bottom: 1rem;
        }
        .hero-kicker { color: #7dd3fc; font-size: .78rem; font-weight: 750; letter-spacing: .16em; text-transform: uppercase; }
        .hero-title { font-size: 2.45rem; font-weight: 760; letter-spacing: -.04em; margin: .35rem 0 .25rem; }
        .hero-subtitle { color: #d8e8f8; font-size: 1.08rem; max-width: 780px; }
        .disclaimer-panel { border-left: 3px solid var(--teal); background: #eefbf8; color: #28544e; padding: .8rem 1rem; border-radius: 0 10px 10px 0; margin: 1rem 0 1.25rem; }
        .stage-card { min-height: 88px; border: 1px solid var(--line); border-radius: 13px; background: white; padding: .8rem; box-shadow: 0 5px 18px rgba(27,51,84,.05); }
        .stage-card.complete { border-color: #a7e2d8; background: #f0fdfa; }
        .stage-card.current { border-color: #8eb1ff; background: #eff6ff; box-shadow: 0 8px 24px rgba(37,99,235,.12); }
        .stage-number { color: var(--blue); font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
        .stage-label { color: var(--navy); font-size: .9rem; font-weight: 700; margin-top: .35rem; line-height: 1.25; }
        .desktop-stage-shell { display: block; }
        .desktop-stage-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem; }
        .desktop-stage-progress { margin-top: .8rem; }
        .desktop-stage-progress-track, .mobile-stage-progress-track {
            width: 100%; height: .5rem; overflow: hidden; border-radius: 999px; background: #e6ebf3;
        }
        .desktop-stage-progress-fill, .mobile-stage-progress-fill {
            height: 100%; border-radius: inherit; background: var(--blue); transition: width .2s ease;
        }
        .desktop-stage-progress-label { color: var(--muted); font-size: .82rem; margin-top: .45rem; }
        .mobile-stage-shell { display: none; }
        .section-eyebrow { color: var(--blue); font-size: .74rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; margin-bottom: -.6rem; }
        .summary-card { background: linear-gradient(135deg, #eff6ff, #f5f3ff); border: 1px solid #cbd9f5; border-radius: 18px; padding: 1.5rem 1.7rem; box-shadow: 0 10px 32px rgba(55,78,132,.08); }
        .summary-label { color: var(--purple); font-size: .75rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
        .summary-title { color: var(--navy); font-size: 1.28rem; font-weight: 750; margin: .35rem 0 .5rem; }
        .summary-body { color: #40516d; line-height: 1.65; }
        .agent-card { min-height: 218px; background: white; border: 1px solid var(--line); border-radius: 16px; padding: 1.15rem; margin-bottom: 1rem; box-shadow: 0 8px 26px rgba(22,45,78,.07); }
        .agent-card-top { display: flex; align-items: center; justify-content: space-between; }
        .agent-icon { color: var(--teal); font-size: 1.4rem; }
        .agent-status { font-size: .7rem; font-weight: 800; padding: .25rem .5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: .05em; }
        .status-active { color: #1d4ed8; background: #dbeafe; }
        .status-ready { color: #087568; background: #d9f7f1; }
        .agent-name { color: var(--navy); font-weight: 760; font-size: 1.05rem; margin-top: .85rem; }
        .agent-role { color: var(--purple); font-size: .78rem; font-weight: 700; margin-top: .15rem; }
        .agent-task { color: var(--muted); font-size: .86rem; line-height: 1.45; margin: .8rem 0; min-height: 52px; }
        .agent-meta { border-top: 1px solid #edf1f7; padding-top: .7rem; display: flex; justify-content: space-between; color: var(--muted); font-size: .76rem; }
        .agency-timeline { border-left: 2px solid #bfdbfe; margin: .6rem 0 1.25rem 5rem; padding-left: 1.4rem; }
        .timeline-event { position: relative; display: grid; grid-template-columns: 80px 1fr; gap: .75rem; padding: 0 0 1.15rem; }
        .timeline-marker { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: var(--blue); border: 3px solid #dbeafe; left: -1.82rem; top: .2rem; }
        .timeline-time { color: var(--blue); font-size: .76rem; font-weight: 750; }
        .timeline-copy { display: flex; flex-direction: column; color: var(--navy); font-size: .88rem; }
        .timeline-copy span { color: var(--muted); font-size: .8rem; margin-top: .15rem; }
        .deliverable-card { min-height: 150px; background: white; border: 1px solid var(--line); border-top: 3px solid var(--teal); border-radius: 14px; padding: 1rem; box-shadow: 0 7px 22px rgba(24,50,82,.06); }
        .deliverable-icon { color: var(--teal); font-size: 1.25rem; }
        .deliverable-stage { color: var(--navy); font-size: .82rem; font-weight: 750; margin-top: .65rem; line-height: 1.3; }
        .deliverable-status { color: var(--purple); font-size: .72rem; font-weight: 750; margin-top: .55rem; }
        /* Keep rich desktop layout as the default while making wide widgets containable. */
        .stApp * { box-sizing: border-box; }
        [data-testid="stDataFrame"],
        [data-testid="stTable"],
        [data-testid="stGraphVizChart"],
        [data-testid="stPlotlyChart"],
        [data-testid="stVegaLiteChart"] {
            width: 100%;
            max-width: 100%;
        }
        [data-testid="stGraphVizChart"],
        [data-testid="stPlotlyChart"],
        [data-testid="stVegaLiteChart"] { overflow-x: auto; }
        [data-testid="stGraphVizChart"] svg { max-width: 100%; height: auto; }
        [data-testid="stFileUploaderDropzone"] { gap: .75rem; }

        /* Tablet: large two-column sections stack; card and metric groups wrap to two columns. */
        @media (max-width: 1100px) {
            .block-container {
                max-width: 100%;
                padding: 1.5rem 1.5rem 4rem;
            }
            .hero-panel { padding: 1.8rem 2rem; }
            .hero-title { font-size: 2.2rem; }
            [data-testid="stHorizontalBlock"] {
                flex-wrap: wrap;
                row-gap: 1rem;
            }
            [data-testid="stHorizontalBlock"] > [data-testid="stColumn"] {
                flex: 1 1 calc(50% - 1rem) !important;
                width: auto !important;
                min-width: min(18rem, 100%) !important;
            }
            [data-testid="stHorizontalBlock"]:has(> [data-testid="stColumn"]:nth-child(2):last-child)
                > [data-testid="stColumn"] {
                flex-basis: 100% !important;
                width: 100% !important;
            }
            [data-testid="stHorizontalBlock"]:has(> [data-testid="stColumn"]:nth-child(5):last-child)
                > [data-testid="stColumn"] {
                flex: 0 0 calc(50% - .5rem) !important;
                min-width: 0 !important;
            }
            [data-testid="stMetric"] { height: 100%; }
            .stage-card, .agent-card, .deliverable-card { height: 100%; }
            .deliverable-card { min-height: 132px; }
            [data-testid="stDataFrame"], [data-testid="stTable"] { overflow-x: auto; }
        }

        /* Mobile: preserve every control and result in a readable one-column flow. */
        @media (max-width: 700px) {
            .block-container {
                padding: 1rem .85rem 3rem;
            }
            h1 { font-size: 1.8rem !important; }
            h2 { font-size: 1.45rem !important; margin-top: 2rem !important; }
            h3 { font-size: 1.2rem !important; }
            .hero-panel {
                border-radius: 16px;
                padding: 1.35rem 1.15rem;
                margin-bottom: .85rem;
            }
            .hero-kicker {
                font-size: .68rem;
                letter-spacing: .11em;
                line-height: 1.45;
            }
            .hero-title {
                font-size: clamp(1.75rem, 9vw, 2.1rem);
                line-height: 1.08;
                overflow-wrap: anywhere;
            }
            .hero-subtitle { font-size: .96rem; line-height: 1.5; }
            .disclaimer-panel { padding: .75rem .8rem; font-size: .88rem; }
            .desktop-stage-shell { display: none; }
            .mobile-stage-shell {
                display: block;
                background: white;
                border: 1px solid var(--line);
                border-radius: 16px;
                padding: 1rem;
                box-shadow: 0 8px 24px rgba(26,54,93,.07);
            }
            .mobile-stage-count {
                color: var(--blue);
                font-size: .76rem;
                font-weight: 800;
                letter-spacing: .08em;
                text-transform: uppercase;
            }
            .mobile-stage-title {
                color: var(--navy);
                font-size: 1.2rem;
                font-weight: 760;
                margin: .25rem 0 .8rem;
            }
            .mobile-stage-controls { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: .9rem; }
            .mobile-stage-button {
                display: block;
                width: 100%;
                border: 1px solid #b9c8df;
                border-radius: 10px;
                padding: .62rem .75rem;
                color: var(--navy) !important;
                font-size: .88rem;
                font-weight: 700;
                text-align: center;
                text-decoration: none !important;
            }
            .mobile-stage-button.next { border-color: var(--blue); background: var(--blue); color: white !important; }
            .mobile-stage-button.disabled { opacity: .45; cursor: not-allowed; }
            [data-testid="stHorizontalBlock"] {
                flex-direction: column !important;
                flex-wrap: nowrap;
                gap: .8rem !important;
            }
            [data-testid="stHorizontalBlock"] > [data-testid="stColumn"] {
                flex: 1 1 100% !important;
                width: 100% !important;
                min-width: 0 !important;
            }
            [data-testid="stHorizontalBlock"]:has(> [data-testid="stColumn"]:nth-child(5):last-child)
                > [data-testid="stColumn"] {
                flex: 1 1 100% !important;
                width: 100% !important;
            }
            [data-testid="stMetric"] { min-height: 0; padding: .85rem 1rem; }
            .stage-card { min-height: 0; padding: .7rem .8rem; }
            .stage-label { margin-top: .2rem; }
            [data-testid="stProgress"] { width: 100%; }
            [data-testid="stProgress"] p { white-space: normal; line-height: 1.35; }
            .stElementContainer:has(> .stButton),
            .stElementContainer:has(> .stDownloadButton) { width: 100% !important; }
            .stButton, .stDownloadButton { width: 100%; }
            .stButton > button, .stDownloadButton > button {
                width: 100%;
                min-height: 2.75rem;
                white-space: normal;
            }
            [role="radiogroup"] {
                align-items: stretch;
                flex-direction: column !important;
            }
            [data-testid="stFileUploader"] { width: 100%; }
            [data-testid="stFileUploaderDropzone"] {
                align-items: stretch;
                flex-direction: column;
                padding: 1rem;
            }
            [data-testid="stFileUploaderDropzone"] > span { width: 100%; }
            [data-testid="stFileUploaderDropzone"] button { width: 100%; }
            [data-testid="stDataFrame"], [data-testid="stTable"] {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            [data-testid="stGraphVizChart"],
            [data-testid="stPlotlyChart"],
            [data-testid="stVegaLiteChart"] {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            [data-testid="stGraphVizChart"] svg { min-width: 36rem; }
            .summary-card { padding: 1.1rem; }
            .summary-title { font-size: 1.1rem; overflow-wrap: anywhere; }
            .summary-body { font-size: .9rem; line-height: 1.55; }
            .agent-card { min-height: 0; margin-bottom: 0; }
            .agent-task { min-height: 0; }
            .agent-meta { align-items: flex-start; flex-direction: column; gap: .3rem; }
            .agency-timeline { margin-left: .6rem; padding-left: 1rem; }
            .timeline-event { grid-template-columns: 1fr; gap: .25rem; }
            .timeline-marker { left: -1.42rem; }
            .timeline-copy span { overflow-wrap: anywhere; }
            .deliverable-card { min-height: 0; }
            [data-testid="stTabs"] [role="tablist"] { overflow-x: auto; }
            [data-testid="stTabs"] [role="tab"] { flex: 0 0 auto; }
            pre, code { max-width: 100%; white-space: pre; overflow-x: auto; }
        }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    """
    <div class="hero-panel">
        <div class="hero-kicker">Enterprise AI Consulting Engagement</div>
        <div class="hero-title">Modernization AI Lab</div>
        <div class="hero-subtitle">AI Modernization Agency for Enterprise Data Platforms</div>
    </div>
    """,
    unsafe_allow_html=True,
)
st.markdown(
    """
    <div class="disclaimer-panel">◌ All organizations, systems, volumes, costs, and recommendations shown are synthetic and created solely for demonstration.</div>
    """,
    unsafe_allow_html=True,
)

stages = ["Intake", "Assessment", "Candidate", "Implementation", "Executive Review"]
stage_anchors = [
    "intake",
    "consulting-assessment",
    "recommended-modernization-candidate",
    "modernization-engineering-engagement",
    "ai-agency-operations",
]
completed_stage = workflow_stage(st.session_state)
current_stage = min(completed_stage + 1, len(stages))
desktop_stage_cards = []
for index, stage in enumerate(stages, start=1):
    stage_class = "complete" if index <= completed_stage else "current" if index == completed_stage + 1 else ""
    desktop_stage_cards.append(
        f'<div class="stage-card {stage_class}">'
        f'<div class="stage-number">0{index}</div>'
        f'<div class="stage-label">{escape(stage)}</div>'
        '</div>'
    )

previous_stage = max(1, current_stage - 1)
next_stage = min(len(stages), current_stage + 1)
previous_control = (
    '<span class="mobile-stage-button disabled" aria-disabled="true">Previous</span>'
    if current_stage == 1
    else f'<a class="mobile-stage-button" href="#{stage_anchors[previous_stage - 1]}">Previous</a>'
)
next_control = (
    '<span class="mobile-stage-button next disabled" aria-disabled="true">Next</span>'
    if current_stage == len(stages)
    else f'<a class="mobile-stage-button next" href="#{stage_anchors[next_stage - 1]}">Next</a>'
)

stage_markup = (
    '<div class="desktop-stage-shell">'
    f'<div class="desktop-stage-grid">{"".join(desktop_stage_cards)}</div>'
    '<div class="desktop-stage-progress">'
    f'<div class="desktop-stage-progress-track" role="progressbar" aria-label="Engagement progress" aria-valuemin="0" aria-valuemax="5" aria-valuenow="{completed_stage}">'
    f'<div class="desktop-stage-progress-fill" style="width: {completed_stage / len(stages) * 100:.0f}%"></div>'
    '</div>'
    f'<div class="desktop-stage-progress-label">Engagement progress · {completed_stage} of {len(stages)} stages complete</div>'
    '</div>'
    '</div>'
    '<div class="mobile-stage-shell">'
    f'<div class="mobile-stage-count">Stage {current_stage} of {len(stages)}</div>'
    f'<div class="mobile-stage-title">{escape(stages[current_stage - 1])}</div>'
    f'<div class="mobile-stage-progress-track" role="progressbar" aria-label="Current stage" aria-valuemin="1" aria-valuemax="5" aria-valuenow="{current_stage}">'
    f'<div class="mobile-stage-progress-fill" style="width: {current_stage / len(stages) * 100:.0f}%"></div>'
    '</div>'
    f'<div class="mobile-stage-controls">{previous_control}{next_control}</div>'
    '</div>'
)
st.markdown(stage_markup, unsafe_allow_html=True)

st.divider()
st.header("Intake")
intake_choice = st.radio(
    "Choose an intake method",
    ("Load Apex Aerospace Demo", "Upload Enterprise Package"),
    horizontal=True,
)

if intake_choice == "Upload Enterprise Package":
    st.file_uploader(
        "Upload Enterprise Package",
        type=("zip", "json", "csv"),
        help="Upload processing will be added in a future sprint.",
    )
    st.caption("Upload processing is not available in Sprint 1.")
else:
    if st.button("Load Apex Aerospace Demo", type="primary"):
        try:
            store_intake(st.session_state, load_demo_engagement(APEX_DATA_DIR))
            st.rerun()
        except DataLoadError as exc:
            clear_intake(st.session_state)
            st.error(f"Apex demo could not be loaded. {exc}")

if "enterprise_profile" in st.session_state and "portfolio" in st.session_state:
    profile = st.session_state["enterprise_profile"]
    portfolio = st.session_state["portfolio"]
    summary = st.session_state.get("portfolio_summary", portfolio_summary(portfolio))

    st.success("Apex Aerospace demo loaded successfully.")
    st.subheader(profile.enterprise_name)
    st.write(f"**Industry:** {profile.industry}")
    st.write(f"**Modernization objective:** {profile.modernization_objective}")

    metric_columns = st.columns(3)
    metric_columns[0].metric("Platforms", f"{summary['platform_count']:,}")
    metric_columns[1].metric(
        "Total annual platform cost",
        f"${summary['annual_platform_cost']:,.0f}",
    )
    metric_columns[2].metric(
        "Critical platforms", f"{summary['critical_platform_count']:,}"
    )

    st.subheader("Enterprise Platform Portfolio")
    st.dataframe(
        portfolio,
        width="stretch",
        hide_index=True,
        column_config={
            "annual_cost_usd": st.column_config.NumberColumn(
                "Annual Cost (USD)", format="$%d"
            ),
            "data_volume_tb": st.column_config.NumberColumn("Data Volume (TB)", format="%.0f"),
        },
    )

    st.divider()
    st.header("Consulting Assessment")
    st.write(
        "Evaluate the portfolio using a transparent consulting model for business value, "
        "technical health, modernization readiness, delivery complexity, migration risk, "
        "and operating-cost pressure."
    )
    st.caption(
        "Python owns every numeric calculation, priority rank, 6R disposition, and "
        "migration-wave assignment. No AI is used for calculations."
    )

    if st.button("Run Modernization Assessment", type="primary"):
        try:
            assessment_result = run_assessment(
                portfolio,
                ASSESSMENT_OUTPUT_DIR,
                profile.enterprise_id,
            )
            store_assessment(st.session_state, assessment_result)
            st.rerun()
        except (RuntimeError, ValueError) as exc:
            clear_assessment(st.session_state)
            st.error(f"The consulting assessment could not be completed. {exc}")

if "assessment" in st.session_state:
    assessment = st.session_state["assessment"]
    assessment_trust = st.session_state.get("assessment_trust", {})
    candidate = selected_candidate(assessment)
    candidate_name = str(candidate["platform_name"])

    st.success(
        "Consulting assessment completed and stored as "
        f"`{Path(st.session_state['assessment_artifact']).name}`."
    )

    if assessment_trust:
        st.subheader("Assessment Trust & Evidence Health")
        trust_status = str(assessment_trust.get("trust_status", "Unavailable"))
        trust_icons = {
            "Ready": "✓ Ready",
            "ReadyWithWarnings": "△ Ready With Warnings",
            "NeedsEvidence": "◇ Needs Evidence",
            "Blocked": "✕ Blocked",
        }
        trust_columns = st.columns(4)
        trust_columns[0].metric(
            "Assessment trust", trust_icons.get(trust_status, "— Unavailable")
        )
        trust_columns[1].metric(
            "Evidence completeness",
            f"{float(assessment_trust.get('quality_completeness') or 0):.1f}%",
            help="Evidence quality is reported separately and never changes the calculated modernization score.",
        )
        trust_columns[2].metric(
            "Current evidence",
            f"{float(assessment_trust.get('current_evidence_percentage') or 0):.1f}%",
        )
        trust_columns[3].metric(
            "Missing requirements",
            int(assessment_trust.get("missing_requirement_count", 0)),
        )
        risk_columns = st.columns(3)
        risk_columns[0].metric(
            "Stale evidence", int(assessment_trust.get("stale_evidence_count", 0))
        )
        risk_columns[1].metric(
            "Evidence conflicts", int(assessment_trust.get("conflict_count", 0))
        )
        risk_columns[2].metric(
            "Low-confidence evidence",
            int(assessment_trust.get("low_confidence_evidence_count", 0)),
        )
        if assessment_trust.get("evidence_health_explanation"):
            if trust_status == "Blocked":
                st.error(str(assessment_trust["evidence_health_explanation"]))
            elif trust_status in {"NeedsEvidence", "ReadyWithWarnings"}:
                st.warning(str(assessment_trust["evidence_health_explanation"]))
            else:
                st.success(str(assessment_trust["evidence_health_explanation"]))
        if not assessment_trust["evidence_complete"]:
            st.warning(
                "Required evidence is missing for one or more criteria. Affected "
                "results are explicitly qualified in the stored artifact."
            )
        with st.expander("Inspect calculation ownership and reproducibility hashes"):
            st.write(
                "**Calculated score owner:** Python deterministic assessment engine. "
                "Evidence quality qualifies confidence; it does not rewrite scores."
            )
            st.write(f"**Definition version:** `{assessment_trust['definition_version']}`")
            st.write(f"**Run ID:** `{assessment_trust['run_id']}`")
            st.write(f"**Definition ID:** `{assessment_trust['definition_id']}`")
            st.write(f"**Definition hash:** `{assessment_trust['definition_hash']}`")
            st.write(
                f"**Evidence snapshot ID:** `{assessment_trust['evidence_snapshot_id']}`"
            )
            st.write(
                f"**Evidence snapshot hash:** `{assessment_trust['evidence_snapshot_hash']}`"
            )
            st.write(f"**Result hash:** `{assessment_trust['result_hash']}`")
            st.write(f"**Engine version:** `{assessment_trust['engine_version']}`")

        assessment_run = st.session_state.get("assessment_run")
        evidence_snapshot = st.session_state.get("assessment_evidence_snapshot")
        assessment_definition = st.session_state.get("assessment_definition")
        if assessment_run and evidence_snapshot and assessment_definition:
            severe_findings = [
                finding
                for finding in assessment_run.findings
                if finding.severity in {"Critical", "High"}
            ]
            if severe_findings:
                st.markdown("**Key evidence risks**")
                for finding in severe_findings[:4]:
                    st.write(
                        f"- **{finding.severity} · {finding.title}** — "
                        f"{finding.remediation}"
                    )

            st.subheader("Dimension & Criterion Evidence Review")
            st.caption(
                "Observed = source fact · Derived = deterministic rule result · "
                "Inferred = bounded interpretation · Assumed = explicit assumption · "
                "Recommended = remediation or next action."
            )
            platform_ids = assessment["platform_id"].astype(str).tolist()
            platform_names = assessment["platform_name"].astype(str).tolist()
            selected_platform_name = st.selectbox(
                "Inspect evidence for platform",
                platform_names,
                index=platform_names.index(candidate_name),
                key="assessment_evidence_platform",
            )
            selected_platform_id = platform_ids[
                platform_names.index(selected_platform_name)
            ]
            criterion_results = {
                result.criterion_id: result
                for result in assessment_run.criterion_results
                if result.asset_id == selected_platform_id
            }
            quality_results = {
                result.criterion_id: result
                for result in assessment_run.evidence_quality_results
                if result.asset_id == selected_platform_id
            }
            links_by_result = {}
            for link in assessment_run.evidence_links:
                links_by_result.setdefault(link.criterion_result_id, []).append(link)
            evidence_by_id = {
                record.evidence_id: record for record in evidence_snapshot.records
            }
            requirements_by_id = {
                requirement.requirement_id: requirement
                for requirement in assessment_run.evidence_requirements
            }
            findings_by_result = {}
            for finding in assessment_run.findings:
                if finding.asset_id == selected_platform_id:
                    findings_by_result.setdefault(finding.criterion_id, []).append(finding)

            if len(quality_results) != len(criterion_results):
                st.warning(
                    "Evidence-quality detail is partially available for this earlier or degraded run."
                )
            for criterion in assessment_definition.criteria:
                result = criterion_results.get(criterion.criterion_id)
                quality = quality_results.get(criterion.criterion_id)
                if result is None:
                    continue
                finding_count = len(findings_by_result.get(criterion.criterion_id, []))
                quality_label = (
                    f"{quality.completeness_score:.1f}% evidence · "
                    f"{quality.freshness_status} · {finding_count} finding(s)"
                    if quality is not None
                    else "Evidence quality unavailable"
                )
                with st.expander(
                    f"{criterion.dimension} — score {result.value:.1f} · {quality_label}"
                ):
                    st.write(f"**Criterion:** `{criterion.criterion_id}`")
                    st.write(f"**Calculated result:** {result.value:.1f}")
                    st.write(f"**Scoring owner:** {assessment_run.calculation_owner}")
                    if quality is None:
                        st.info(
                            "This schema-compatible run has no criterion evidence-quality record."
                        )
                        continue
                    indicators = st.columns(4)
                    indicators[0].metric(
                        "Completeness", f"{quality.completeness_score:.1f}%"
                    )
                    indicators[1].metric("Freshness", quality.freshness_status)
                    indicators[2].metric(
                        "Evidence confidence", f"{quality.confidence_score:.1f}%"
                    )
                    indicators[3].metric(
                        "Source authority", f"{quality.authority_score:.1f}%"
                    )
                    st.write(f"**Conflict status:** {quality.conflict_status}")
                    result_links = links_by_result.get(result.criterion_result_id, [])
                    evidence_links = [link for link in result_links if link.evidence_id]
                    if evidence_links:
                        st.markdown("**Evidence relationships**")
                        for link in evidence_links:
                            record = evidence_by_id.get(link.evidence_id)
                            if record is None:
                                st.warning(
                                    f"Evidence `{link.evidence_id}` is referenced but unavailable."
                                )
                                continue
                            relation_icon = "✕" if link.relationship_type == "Contradicts" else "✓"
                            st.write(
                                f"- {relation_icon} **{link.relationship_type}:** "
                                f"`{record.evidence_id}` · {record.evidence_category} · "
                                f"{record.source_authority} · confidence {record.confidence:.2f} · "
                                f"effective {record.effective_at.date().isoformat()}"
                            )
                    else:
                        st.info("No matching evidence is linked to this criterion.")
                    if quality.missing_requirement_ids:
                        st.markdown("**Missing requirements**")
                        for requirement_id in quality.missing_requirement_ids:
                            requirement = requirements_by_id.get(requirement_id)
                            if requirement is not None:
                                blocking = "Blocking" if requirement.blocking else "Non-blocking"
                                st.write(
                                    f"- ◇ **{blocking}:** {requirement.description} "
                                    f"(`{requirement.requirement_id}`)"
                                )
                    criterion_findings = findings_by_result.get(
                        criterion.criterion_id, []
                    )
                    if criterion_findings:
                        st.markdown("**Findings and remediation**")
                        for finding in criterion_findings:
                            st.write(
                                f"- **{finding.classification} · {finding.finding_type} · "
                                f"{finding.severity}:** {finding.description}  \n"
                                f"  **Remediation:** {finding.remediation}"
                            )
        else:
            st.info(
                "This earlier schema-compatible assessment has reproducibility metadata "
                "but no Slice 02 evidence-quality findings. Rerun to generate them."
            )

    assessment_display = assessment.rename(
        columns={
            "priority_rank": "Priority Rank",
            "platform_name": "Platform",
            "business_value": "Business Value",
            "technical_debt": "Technical Debt",
            "cloud_readiness": "Cloud Readiness",
            "ai_readiness": "AI Readiness",
            "complexity": "Complexity",
            "migration_risk": "Risk",
            "operating_cost_usd": "Operating Cost (USD)",
            "priority_score": "Priority",
            "six_r_recommendation": "6R",
            "migration_wave": "Migration Wave",
        }
    )[
        [
            "Priority Rank",
            "Platform",
            "Business Value",
            "Technical Debt",
            "Cloud Readiness",
            "AI Readiness",
            "Complexity",
            "Risk",
            "Operating Cost (USD)",
            "Priority",
            "6R",
            "Migration Wave",
        ]
    ]

    def highlight_candidate(row):
        if row["Platform"] == candidate_name:
            return ["background-color: #fff3bf; font-weight: 600"] * len(row)
        return [""] * len(row)

    st.dataframe(
        assessment_display.style.apply(highlight_candidate, axis=1),
        width="stretch",
        hide_index=True,
        column_config={
            "Operating Cost (USD)": st.column_config.NumberColumn(format="$%d"),
            "Business Value": st.column_config.NumberColumn(format="%.1f"),
            "Technical Debt": st.column_config.NumberColumn(format="%.1f"),
            "Cloud Readiness": st.column_config.NumberColumn(format="%.1f"),
            "AI Readiness": st.column_config.NumberColumn(format="%.1f"),
            "Complexity": st.column_config.NumberColumn(format="%.1f"),
            "Risk": st.column_config.NumberColumn(format="%.1f"),
            "Priority": st.column_config.NumberColumn(format="%.1f"),
        },
    )

    st.header("Recommended Modernization Candidate")
    st.success(candidate_name)
    candidate_metrics = st.columns(5)
    candidate_metrics[0].metric("Business Value", f"{candidate['business_value']:.1f}")
    candidate_metrics[1].metric("Complexity", f"{candidate['complexity']:.1f}")
    candidate_metrics[2].metric("Risk", f"{candidate['migration_risk']:.1f}")
    candidate_metrics[3].metric("Priority", f"{candidate['priority_score']:.1f}")
    candidate_metrics[4].metric("Migration Wave", candidate["migration_wave"])
    st.write(f"**Deterministic 6R recommendation:** {candidate['six_r_recommendation']}")

    recommendations = st.session_state.get("modernization_recommendations", ())
    governed_recommendation = next(
        (
            recommendation
            for recommendation in recommendations
            if recommendation.asset_id == str(candidate["platform_id"])
        ),
        None,
    )
    if governed_recommendation is not None:
        st.subheader("Governed 6R Recommendation")
        st.caption(
            "Evidence → Findings → Recommendation → Governed Decision. "
            "This record is a recommendation only; execution authority is None."
        )
        recommendation_metrics = st.columns(4)
        recommendation_metrics[0].metric(
            "Recommended strategy",
            governed_recommendation.recommended_strategy.value,
        )
        recommendation_metrics[1].metric(
            "Confidence",
            f"{governed_recommendation.confidence * 100:.1f}%",
            help="Deterministic evidence confidence, not an LLM probability.",
        )
        recommendation_metrics[2].metric(
            "Recommendation trust", governed_recommendation.trust_status
        )
        recommendation_metrics[3].metric(
            "Version", governed_recommendation.recommendation_version
        )
        if governed_recommendation.trust_status == "Blocked":
            st.error(
                "This recommendation is blocked from governed decision progression "
                "until its blocking evidence issues are resolved."
            )
        elif governed_recommendation.trust_status == "Warning":
            st.warning("Review the identified evidence limitations before decisioning.")
        else:
            st.success("The recommendation evidence is ready for governed review.")
        st.write(governed_recommendation.rationale)

        with st.expander("Why not the other five strategies?"):
            for alternative in governed_recommendation.alternatives:
                st.write(
                    f"- **{alternative.strategy.value} · fit {alternative.fit_score:.1f}/100:** "
                    f"{alternative.reason_not_selected}"
                )

        with st.expander("Supporting evidence and provenance"):
            for evidence_reference in governed_recommendation.supporting_evidence:
                st.write(
                    f"- `{evidence_reference.evidence_id}` · "
                    f"{evidence_reference.evidence_category} · "
                    f"confidence {evidence_reference.confidence:.2f}  \n"
                    f"  {evidence_reference.provenance}  \n"
                    f"  Source: `{evidence_reference.source_reference}`"
                )
            if governed_recommendation.missing_evidence_requirement_ids:
                st.markdown("**Missing evidence requirements**")
                for requirement_id in governed_recommendation.missing_evidence_requirement_ids:
                    st.write(f"- `{requirement_id}`")
            if governed_recommendation.conflicting_evidence_ids:
                st.markdown("**Conflicting evidence**")
                for evidence_id in governed_recommendation.conflicting_evidence_ids:
                    st.write(f"- `{evidence_id}`")
            st.write(
                f"**Recommendation ID:** `{governed_recommendation.recommendation_id}`  \n"
                f"**Recommendation hash:** `{governed_recommendation.recommendation_hash}`  \n"
                f"**Status:** {governed_recommendation.status}  \n"
                f"**Authority:** {governed_recommendation.authority_scope}  \n"
                f"**Execution authority:** {governed_recommendation.execution_authority}"
            )

    st.subheader("Hermes — Modernization Director")
    st.markdown("**Consulting Recommendation**")
    st.write(
        st.session_state.get(
            "assessment_recommendation",
            recommendation_for_assessment(assessment),
        )
    )

    st.divider()
    st.header("Modernization Engineering Engagement")
    st.write(
        f"Prepare the implementation-ready starter package for the selected {candidate_name} "
        "modernization to BigQuery."
    )
    st.caption(
        "Engineering mappings, conversions, controls, and package artifacts are generated "
        "deterministically. Narrative sections use the offline deterministic fallback."
    )
    if st.button("Prepare Implementation Ready Package", type="primary"):
        try:
            engineering_result = run_engineering(
                APEX_DATA_DIR,
                IMPLEMENTATION_OUTPUT_DIR,
                candidate,
            )
            store_engineering(st.session_state, engineering_result)
            st.rerun()
        except (DataLoadError, RuntimeError, ValueError) as exc:
            clear_engineering(st.session_state)
            st.error(f"The implementation package could not be prepared. {exc}")

if "engineering_engagement" in st.session_state:
    engineering = st.session_state["engineering_engagement"]
    package_path = Path(st.session_state["implementation_package"])

    st.success(
        "Implementation-ready package generated and stored as "
        f"`{package_path.name}`."
    )

    st.header("1. Metadata Discovery")
    metadata = engineering["metadata"]
    metadata_columns = st.columns(4)
    metadata_columns[0].metric("Schemas", f"{metadata['schemas']:,}")
    metadata_columns[1].metric("Tables", f"{metadata['tables']:,}")
    metadata_columns[2].metric("Views", f"{metadata['views']:,}")
    metadata_columns[3].metric("Stored Procedures", f"{metadata['stored_procedures']:,}")
    metadata_columns = st.columns(4)
    metadata_columns[0].metric("ETL Jobs", f"{metadata['etl_jobs']:,}")
    metadata_columns[1].metric("Reports", f"{metadata['reports']:,}")
    metadata_columns[2].metric("Data Volume", f"{metadata['data_volume_tb']:,} TB")
    metadata_columns[3].metric("Named Owners", f"{len(metadata['owners']):,}")
    st.subheader("Owners")
    owner_rows = [
        {"Accountability": role.replace("_", " ").title(), "Owner": owner}
        for role, owner in metadata["owners"].items()
    ]
    st.dataframe(owner_rows, width="stretch", hide_index=True)

    st.header("2. Dependency Analysis")
    dependencies = engineering["dependencies"]
    dependency_columns = st.columns(2)
    with dependency_columns[0]:
        st.subheader("Upstream")
        for upstream in dependencies["upstream"]:
            st.write(f"- {upstream}")
    with dependency_columns[1]:
        st.subheader("Downstream")
        for downstream in dependencies["downstream"]:
            st.write(f"- {downstream}")
    st.subheader("Critical Dependencies")
    st.dataframe(
        dependencies["critical_dependencies"].rename(
            columns={
                "upstream": "Upstream",
                "downstream": "Downstream",
                "interface_type": "Interface",
                "frequency": "Frequency",
                "criticality": "Criticality",
                "business_process": "Business Process",
                "business_impact": "Business Impact",
            }
        ),
        width="stretch",
        hide_index=True,
    )
    st.subheader("Dependency Graph")
    st.graphviz_chart(dependencies["graph_dot"], width="stretch")
    st.subheader("Business Impact")
    for impact in dependencies["business_impact"]:
        st.write(f"- {impact}")

    st.header("3. Target Architecture")
    architecture = engineering["architecture"]
    st.markdown(f"### {architecture['flow']}")
    st.dataframe(
        architecture["layers"].rename(
            columns={
                "sequence": "Sequence",
                "component": "Component",
                "role": "Role",
                "why": "Why",
            }
        ),
        width="stretch",
        hide_index=True,
    )
    st.markdown("**Why this architecture**")
    st.write(architecture["explanation"])
    st.caption(f"Narrative source: {architecture['narrative_source']}")

    st.header("4. Source-to-Target Mapping")
    st.dataframe(engineering["mapping"], width="stretch", hide_index=True)

    st.header("5. SQL Modernization")
    sql_tabs = st.tabs(["Oracle Source SQL", "BigQuery SQL", "Target DDL", "Assumptions"])
    with sql_tabs[0]:
        st.code(engineering["sql"]["source_sql"], language="sql")
    with sql_tabs[1]:
        st.code(engineering["sql"]["bigquery_sql"], language="sql")
    with sql_tabs[2]:
        st.code(engineering["sql"]["target_ddl"], language="sql")
    with sql_tabs[3]:
        for assumption in engineering["sql"]["assumptions"]:
            st.write(f"- {assumption}")

    st.header("6. ETL Modernization")
    etl = engineering["etl"]
    st.write(f"**Informatica pipeline:** {etl['pipeline_name']}")
    st.write(f"**Cloud-native pipeline:** {etl['target_pipeline']}")
    st.write(f"**Orchestration:** {etl['orchestration']}")
    st.write(etl["explanation"])
    st.dataframe(etl["steps"], width="stretch", hide_index=True)
    st.write(f"**Failure policy:** {etl['failure_policy']}")
    st.caption(f"Narrative source: {etl['narrative_source']}")

    st.header("7. Validation")
    validation = engineering["validation"]
    st.dataframe(validation["controls"], width="stretch", hide_index=True)
    validation_columns = st.columns(2)
    with validation_columns[0]:
        st.subheader("Business Rule Validation")
        for rule in validation["business_rules"]:
            st.write(f"- {rule}")
    with validation_columns[1]:
        st.subheader("Manual Review Items")
        for item in validation["manual_review_items"]:
            st.write(f"- {item}")

    st.header("8. Implementation Ready Package")
    st.markdown(
        f"""
        <div class="summary-card">
            <div class="summary-label">Executive Summary</div>
            <div class="summary-title">{escape(str(engineering['candidate']))} → BigQuery</div>
            <div class="summary-body">{escape(str(engineering['executive_summary']))}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.caption(f"Executive summary source: {engineering['narrative_source']}")
    st.download_button(
        "Download Implementation Ready Package",
        data=download_package(package_path),
        file_name=package_path.name,
        mime="application/zip",
        type="primary",
    )
    st.write(
        "Package contents: Executive Summary, Architecture, Source Target Mapping, "
        "Converted SQL, Target DDL, ETL Translation, Validation Report, Implementation "
        "Backlog, Assumptions, Decision Log, and manifest."
    )
    st.subheader("Implementation Backlog")
    st.dataframe(engineering["backlog"], width="stretch", hide_index=True)
    package_columns = st.columns(2)
    with package_columns[0]:
        st.subheader("Assumptions")
        for assumption in engineering["assumptions"]:
            st.write(f"- {assumption}")
    with package_columns[1]:
        st.subheader("Decision Log")
        for index, decision in enumerate(engineering["decision_log"], start=1):
            st.write(f"{index}. {decision}")

    st.divider()
    st.header("AI Agency Operations")
    st.caption(
        "This is the operating view of the AI consulting agency—not an executive dashboard. "
        "Hermes directs specialists, reuses approved evidence, and routes high-risk decisions "
        "to human approval."
    )

    agency_context = load_agency_context(APEX_DATA_DIR / "business_constraints.json")
    original_budget = agency_context.original_budget
    original_downtime = agency_context.original_downtime
    initialize_agency_state(st.session_state, agency_context)

    agency_start = datetime.fromisoformat(st.session_state["agency_start_time"])
    replanned = "agency_replan" in st.session_state
    phase = "Adaptive Replanning Complete" if replanned else "Implementation Package Prepared"

    with st.status(
        f"Hermes is directing the agency · Current Engagement Phase: {phase}",
        expanded=True,
        state="complete",
    ):
        st.write("Specialists are coordinated through deterministic handoffs and stored artifacts.")
        st.progress(1.0, text="Agency delivery evidence synchronized")

    st.markdown('<div class="section-eyebrow">Agency Roster</div>', unsafe_allow_html=True)
    st.subheader("Agent Cards")
    operations = build_agent_operations(agency_start, replanned=replanned)
    render_agent_cards(operations)
    with st.expander("View complete agent operating details"):
        st.dataframe(operations, width="stretch", hide_index=True)

    timeline_tabs = st.tabs(["Agent Timeline", "Manager Timeline"])
    with timeline_tabs[0]:
        agent_events = agent_timeline(agency_start, replanned=replanned)
        render_timeline(agent_events)
        st.dataframe(
            agent_events,
            width="stretch",
            hide_index=True,
        )
    with timeline_tabs[1]:
        st.dataframe(
            manager_timeline(agency_start, replanned=replanned),
            width="stretch",
            hide_index=True,
        )

    st.markdown('<div class="section-eyebrow">Live Engagement</div>', unsafe_allow_html=True)
    st.subheader("Current Engagement Status")
    status_columns = st.columns(3)
    status_columns[0].metric("Current Phase", phase)
    status_columns[1].metric("Active Manager", "Hermes")
    status_columns[2].metric("Approval", agency_context.approval)

    st.markdown('<div class="section-eyebrow">Consulting Outputs</div>', unsafe_allow_html=True)
    st.subheader("Consulting Deliverables")
    delivery_chain = executive_delivery_chain(
        package_path.name, str(engineering["candidate"])
    )
    render_deliverable_cards(delivery_chain)
    st.dataframe(
        delivery_chain,
        width="stretch",
        hide_index=True,
    )

    st.divider()
    st.header("Business Constraints — Live Replanning")
    st.write(
        "Change a constraint and Hermes will preserve completed evidence, rerun only the "
        "planner and validation specialist, and publish a revised plan."
    )
    constraint_columns = st.columns(3)
    with constraint_columns[0]:
        st.number_input(
            "Budget (USD)",
            min_value=1_000_000.0,
            max_value=original_budget,
            step=50_000.0,
            key="agency_budget",
            on_change=request_agency_replan,
        )
    with constraint_columns[1]:
        st.slider(
            "Downtime (hours)",
            min_value=0,
            max_value=24,
            key="agency_downtime",
            on_change=request_agency_replan,
        )
    with constraint_columns[2]:
        st.selectbox(
            "Business Priority",
            (
                "Customer Analytics Continuity",
                "Supply Chain Resilience",
                "Operating Cost Reduction",
            ),
            key="agency_business_priority",
            on_change=request_agency_replan,
        )

    st.button(
        "Apply 30% Budget Reduction",
        type="primary",
        on_click=apply_thirty_percent_reduction,
    )

    if st.session_state["agency_replan_requested"]:
        replan_completed = False
        try:
            replan_result = run_replan(
                assessment,
                original_budget=original_budget,
                new_budget=float(st.session_state["agency_budget"]),
                downtime_hours=int(st.session_state["agency_downtime"]),
                business_priority=st.session_state["agency_business_priority"],
                output_directory=REPLAN_OUTPUT_DIR,
            )
            store_replan(st.session_state, replan_result)
            replan_completed = True
        except (RuntimeError, ValueError) as exc:
            clear_replan(st.session_state)
            st.error(f"Hermes could not create the revised plan. {exc}")
        finally:
            complete_replan_request(st.session_state)
        if replan_completed:
            st.rerun()

    st.subheader("Original Plan")
    original_plan_data = original_plan(assessment, original_budget)
    st.dataframe(original_plan_data, width="stretch", hide_index=True)

    if "agency_replan" in st.session_state:
        agency_replan = st.session_state["agency_replan"]
        st.success(
            f"Hermes created a new plan for a "
            f"{agency_replan['budget_reduction_percent']:.1f}% budget reduction and stored "
            f"`{Path(st.session_state['agency_replan_artifact']).name}`."
        )
        reuse_columns = st.columns(2)
        with reuse_columns[0]:
            st.markdown("**Reused—no rerun**")
            for item in agency_replan["reused"]:
                st.write(f"- {item}")
        with reuse_columns[1]:
            st.markdown("**Rerun by Hermes**")
            for item in agency_replan["rerun"]:
                st.write(f"- {item}")

        st.subheader("New Plan")
        st.dataframe(agency_replan["new_plan"], width="stretch", hide_index=True)
        st.subheader("What Changed")
        st.dataframe(agency_replan["what_changed"], width="stretch", hide_index=True)
        st.subheader("Why")
        st.write(agency_replan["why"])

        value_columns = st.columns(3)
        value_columns[0].metric(
            "Full Replan Effort", f"{agency_replan['full_replan_hours']} hours"
        )
        value_columns[1].metric(
            "Incremental Replan", f"{agency_replan['incremental_replan_hours']} hours"
        )
        value_columns[2].metric(
            "Time Saved", f"{agency_replan['time_saved_hours']} hours", delta="64% faster"
        )
        st.write(f"**Validation result:** {agency_replan['validation_result']}")
