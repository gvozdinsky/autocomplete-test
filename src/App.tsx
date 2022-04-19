import Autocomplete, { useAutocomplete } from "./components/Autocomplete";
import { OptionType } from "./components/Autocomplete/types";

async function fetchUsersFromServerByName(name: string) {
  const users: Array<{ name: string; id: number }> = await (
    await fetch("https://jsonplaceholder.typicode.com/users")
  ).json();
  return users.filter((user) =>
    user.name.toLowerCase().startsWith(name.toLowerCase())
  );
}

function App() {
  function handleSelect(option: OptionType) {
    console.log(`selected option ${JSON.stringify(option, null, 2)}`);
  }
  const { inputProps, asyncOptionsLoadProps } = useAutocomplete({
    async loadOptions({ inputValue }) {
      const users = await fetchUsersFromServerByName(inputValue);
      return users.map((user) => ({ label: user.name, value: user.name }));
    },
    debounceDelay: 300,
  });

  const { inputProps: inputPropsLocal } = useAutocomplete();

  const options = [
    { label: "Dima", value: "dima" },
    { label: "Valera", value: "valera" },
    { label: "Vova", value: "vova" },
    { label: "Volodea", value: "volodea" },
  ];

  return (
    <div className="app">
      <p>
        You can use <b>ArrowUp / ArrowDown</b> to navigate options, <b>Enter</b>{" "}
        to select an option
      </p>
      <b> options loaded from server </b>
      <Autocomplete
        {...inputProps}
        {...asyncOptionsLoadProps}
        onSelect={handleSelect}
      />
      <br />
      <b>options from local array </b>
      <Autocomplete
        {...inputPropsLocal}
        options={options}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default App;
