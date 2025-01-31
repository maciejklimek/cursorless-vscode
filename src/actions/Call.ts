import {
  Action,
  ActionReturnValue,
  ActionPreferences,
  Graph,
  TypedSelection,
} from "../Types";
import { ensureSingleTarget } from "../targetUtils";

export default class Call implements Action {
  targetPreferences: ActionPreferences[] = [{ insideOutsideType: "inside" }];

  constructor(private graph: Graph) {
    this.run = this.run.bind(this);
  }

  async run([sources, destinations]: [
    TypedSelection[],
    TypedSelection[]
  ]): Promise<ActionReturnValue> {
    ensureSingleTarget(sources);
    ensureSingleTarget(destinations);

    const { returnValue: texts } = await this.graph.actions.getText.run(
      [sources],
      {
        showDecorations: false,
      }
    );

    return this.graph.actions.wrap.run([destinations], texts[0] + "(", ")");
  }
}
