import React from "react";
import * as R from "ramda";
import { fnToPrettySource } from "./utils";

import { Card, Code, Badge, Button, Icon, Pane } from "evergreen-ui";
import { updateConverge } from "./lensGuide";

const nameLens = R.lensPath(["person", "name"]);
const ageLens = R.lensPath(["person", "age"]);
const isActiveLens = R.lensPath(["user", "isActive"]);
const userIdLens = R.lensPath(["user", "id"]);

class App extends React.Component {
  state = {
    person: { name: "Brandon", age: 37 },
    user: { id: 123, isActive: true }
  };

  // (2) Set - R.set
  ageReset = () => this.setState(R.set(ageLens, 37));
  activeSetYes = () => this.setState(R.set(isActiveLens, true));
  activeSetNo = () => this.setState(R.set(isActiveLens, false));

  // (3) Update - R.over
  ageInc = () => this.setState(R.over(ageLens, R.inc));
  ageDec = () => this.setState(R.over(ageLens, R.dec));
  activeToggle = () => this.setState(R.over(isActiveLens, R.not));

  activeToggle_Evolve = () =>
    this.setState(R.evolve({ user: { isActive: R.not } }));
  activeToggle_Converge = () =>
    this.setState(updateConverge(R.not)(["user", "isActive"]));
  render() {
    // (1) Get - R.view
    const userId = R.view(userIdLens, this.state);
    const name = R.view(nameLens, this.state);
    const age = R.view(ageLens, this.state);
    const isActive = R.view(isActiveLens, this.state);

    return (
      <div className="App">
        <StateFocus name="id" value={userId} />

        <StateFocus name="name" value={name} />

        <StateFocus name="age" value={age}>
          <Card flex={3} padding={5} elevation={0} background="purpleTint">
            <Badge color="orange">Using Lens</Badge>
            <br />
            <DoButton onClick={this.ageDec} icon="minus" />
            <DoButton onClick={this.ageInc} icon="plus" />
            <DoButton onClick={this.ageReset} text="Reset" />
          </Card>
        </StateFocus>

        <StateFocus name="active" value={isActive ? "Yes" : "No"}>
          <Card padding={5} elevation={0} background="white">
            <Badge color="orange">Using Lens</Badge>
            <br />
            <DoButton onClick={this.activeToggle} text="Toggle" />
            <DoButton onClick={this.activeSetYes} text="Set Active" />
            <DoButton onClick={this.activeSetNo} text="Set Inactive" />
            <hr />

            <Badge color="orange">Using Evolve</Badge>
            <br />
            <DoButton
              onClick={this.activeToggle_Evolve}
              text="Toggle (evolve)"
            />
            <hr />

            <Badge color="orange">Using Converge</Badge>
            <br />
            <DoButton
              onClick={this.activeToggle_Converge}
              text="Toggle (converge)"
              float="left"
            />
          </Card>
        </StateFocus>
      </div>
    );
  }
}

const beautifyJsConfig = {
  indent_size: "2",
  indent_char: " ",
  max_preserve_newlines: "5",
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: true,
  indent_scripts: "normal",
  brace_style: "collapse",
  space_before_conditional: true,
  unescape_strings: true,
  jslint_happy: true,
  end_with_newline: true,
  wrap_line_length: "40",
  indent_inner_html: false,
  comma_first: false,
  e4x: false
};
function FnSource({ fn }) {
  if (!fn) return null;
  return (
    <Code display="block" is="pre">
      {fnToPrettySource(fn)}
    </Code>
  );
  //return <Pre display="inline-block">{prettySource}</Pre>;
}

function DoButton({ icon, text, ...props }) {
  return (
    <Pane justifyContent="start">
      <Button {...props}>
        {icon && <Icon icon={icon} />}
        {text}
      </Button>
      <FnSource fn={props.onClick} />
    </Pane>
  );
}

function StateFocus({ name, value, children }) {
  return (
    <Card elevation={1} padding={10} display="flex" margin={10}>
      <Pane flex={2} alignItems="center" display="flex">
        <Badge color="green" width={60}>
          {name}
        </Badge>
        <Code size={600}>{value}</Code>
      </Pane>
      <Pane
        flex={4}
        display="flex"
        flexDirection="column"
        background="purpleTint"
        padding={10}
      >
        {children}
      </Pane>
    </Card>
  );
}

export default App;
