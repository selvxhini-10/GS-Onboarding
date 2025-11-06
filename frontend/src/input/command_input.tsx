import { useEffect, useState } from "react";
import { CommandResponse, MainCommandResponse } from "../data/response"
import "./command_input.css"
import { createCommand, getMainCommands } from "./input_api";

interface CommandInputProp {
  setCommands: React.Dispatch<React.SetStateAction<CommandResponse[]>>
}

const CommandInput = ({ setCommands }: CommandInputProp) => {
  const [selectedCommand, setSelectedCommand] = useState<MainCommandResponse | null>(null);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  // COMPLETED: (Member) Setup anymore states if necessary
  const [mainCommands, setMainCommands] = useState<MainCommandResponse[]>([]);


  // COMPLETED: (Member) Fetch MainCommands in a useEffect
  useEffect(() => {
    const fetchMainCommands = async () => {
      const data = await getMainCommands();
      setMainCommands(data.data);
    };
    fetchMainCommands();
  }, []);

  const handleParameterChange = (param: string, value: string): void => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // COMPLETED:(Member) Submit to your post endpoint 
    e.preventDefault();
    if (!selectedCommand) {
      alert("Please select a command type.");
      return;
    }
    try {
      const commandData = {
        main_command_id: selectedCommand.id,
        params: parameters,
      };
      const data = await createCommand(commandData);
      setCommands(data.data);
    } catch (error) {
      console.error("Error creating command:", error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="spreader">
          <div>
            <label>Command Type: </label>
            {/* COMPLETED: (Member) Display the list of commands based on the get commands request.
                        It should update the `selectedCommand` field when selecting one.*/}
            <select onChange={(e) => setSelectedCommand(mainCommands.find(cmd => cmd.id === Number(e.target.value)) || null)}>
              {mainCommands.map((cmd) => (
                <option key={cmd.id} value={cmd.id}>
                  {cmd.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCommand?.params?.split(",").map((param) => (
            <div key={param}>
              <label htmlFor={`param-${param}`}>{param}: </label>
              <input
                id={`param-${param}`}
                type="text"
                value={parameters[param] || ""}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  )
}

export default CommandInput;
