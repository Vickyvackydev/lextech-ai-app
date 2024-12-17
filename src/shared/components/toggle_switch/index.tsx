import Switch from "@mui/material/Switch";
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

function ToggleSwitch(props: ToggleSwitchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={props.checked}
      onChange={handleChange}
      inputProps={{ "aria-label": "Switch demo" }}
    />
  );
}

export default ToggleSwitch;
