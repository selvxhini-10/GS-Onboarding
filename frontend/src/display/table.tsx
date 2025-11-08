import { CommandResponse } from "../data/response"
import CommandRow from "./row"
import { deleteCommand} from "../display/command_api"

interface CommandTableProp {
  commands: CommandResponse[],
  setCommands: React.Dispatch<React.SetStateAction<CommandResponse[]>>
}

const CommandTable = ({
  commands,
  setCommands
}: CommandTableProp) => {

  const handleDelete = (id: number) => {
    return async () => {
      // COMPLETED: (Member) You will need to create a function in `command_api.ts` so you can delete a command.
      try {
        const updatedCommands = await deleteCommand(id);
        setCommands(updatedCommands.data);
      } catch (error) {
        console.error(`Error deleting command with id ${id}: ${error}`);
      }
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID: </th>
          <th>Main Command ID: </th>
          <th>Params: </th>
          <th>Status: </th>
          <th>Created On: </th>
          <th>Updated On: </th>
          <th>Delete</th>
        </tr>
      </thead>
      <thead>
        {commands.map(value => (<CommandRow key={value.id} {...value} handleDelete={handleDelete(value.id)} />))}
      </thead>
    </table>
  )
}

export default CommandTable;
