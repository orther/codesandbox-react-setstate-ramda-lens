import React from "react";
import ReactDOM from "react-dom";
import R from "ramda";

import { Card, Code, Badge, Button, Icon, Pane } from "evergreen-ui";

const nameLens = R.lensPath(["person", "name"]);
const ageLens = R.lensPath(["person", "age"]);
const isActiveLens = R.lensPath(["user", "isActive"]);
const userIdLens = R.lensPath(["user", "id"]);

class App extends React.Component {
  state = {
    person: { name: "Brandon", age: 37 },
    user: { id: 123, isActive: true },
  };

  ageInc = () => this.setState(R.over(ageLens, R.inc));
  ageDec = () => this.setState(R.over(ageLens, R.dec));
  activeToggle = () => this.setState(R.over(isActiveLens, R.not));

  ageReset = () => this.setState(R.set(ageLens, 37));
  activeSetYes = () => this.setState(R.set(isActiveLens, true));
  activeSetNo = () => this.setState(R.set(isActiveLens, false));

  activeToggle_Evolve = () =>
    this.setState(R.evolve({ user: { isActive: R.not } }));
  activeSetYes_Assoc = () =>
    this.setState(R.assocPath(["user", "isActive"], true));
  activeSetNo_Evolve = () =>
    this.setState(R.evolve({ user: { isActive: R.not } }, false));
  activeEvolve_Toggle = () =>
    this.setState(R.evolve({ user: { isActive: R.not } }));
  activeEvolve_Toggle = () =>
    this.setState(R.evolve({ user: { isActive: R.not } }));

  render() {
    const userId = R.view(userIdLens, this.state);
    const name = R.view(nameLens, this.state);
    const age = R.view(ageLens, this.state);
    const isActive = R.view(isActiveLens, this.state);

    return (
      <div className="App">
        <StateFocus name="id" value={userId} />

        <StateFocus name="name" value={name} />

        <StateFocus name="age" value={age}>
          <DoButton onClick={this.ageDec} icon="minus" />
          <DoButton onClick={this.ageInc} icon="plus" />
          <DoButton onClick={this.ageReset} text="Reset" />
        </StateFocus>

        <StateFocus name="active" value={isActive ? "Yes" : "No"}>
          <Card flex={1} padding={5} elevation={0} background="purpleTint">
            <Badge>Using Lens</Badge>
            <br />
            <DoButton onClick={this.activeToggle} text="Toggle" />
            <DoButton onClick={this.activeSetYes} text="Set Active" />
            <DoButton onClick={this.activeSetNo} text="Set Inactive" />
          </Card>

          <Card flex={4} padding={5} elevation={0} background="purpleTint">
            <Badge>Using Evolve</Badge>
            <br />
            <DoButton
              onClick={() =>
                this.setState(R.evolve({ user: { isActive: R.not } }))
              }
              text="Toggle (evolve)"
            />
          </Card>
        </StateFocus>
      </div>
    );
  }
}

function DoButton({ icon, text, ...props }) {
  return (
    <Button {...props}>
      {icon && <Icon icon={icon} />}
      {text}
    </Button>
  );
}

function StateFocus({ name, value, children }) {
  return (
    <Card elevation={1} padding={10} display="flex" margin={10}>
      <Pane flex={1} alignItems="center" display="flex">
        <Badge color="green" width={60}>
          {name}
        </Badge>
        <Code size={300}>{value}</Code>
      </Pane>
      {children}
    </Card>
  );
}

export default App;
