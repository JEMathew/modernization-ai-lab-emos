"""Display the grounded AGENCY-01 risk narrative from the command line."""

from __future__ import annotations

import argparse

from engine.agents.risk_agent import RiskAgent


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("asset_id", nargs="?", default="APX-PLT-001")
    args = parser.parse_args()
    narrative = RiskAgent().explain(args.asset_id)
    print(narrative.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
