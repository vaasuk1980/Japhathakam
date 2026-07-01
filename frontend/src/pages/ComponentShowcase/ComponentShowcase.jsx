import "./ComponentShowcase.css";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select/Select";

const rasiOptions = [
  { value: "mesha", label: "మేషం" },
  { value: "vrushabha", label: "వృషభం" },
  { value: "mithuna", label: "మిథునం" },
];

function ComponentShowcase() {
  return (
    <div className="showcase-page">
      <h1>Enterprise Component Showcase</h1>

      <Card title="Buttons">
        <div className="showcase-row">
          <Button>Primary</Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="danger">
            Danger
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>
        </div>
      </Card>

      <Card title="Input">
        <Input
          id="name"
          label="Name"
          placeholder="Enter your name"
        />
      </Card>

      <Card title="Select">
        <Select
          id="rasi"
          label="Rasi"
          placeholder="Select Rasi"
          options={rasiOptions}
        />
      </Card>
    </div>
  );
}

export default ComponentShowcase;