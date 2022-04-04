import { OptionsType, OptionType } from "./types";
import styles from "./Autocomplete.module.scss";
import { KeyboardEvent, useMemo, useRef, useState } from "react";
import { useClickOutside } from "../../hooks";

type Props = {
  inputValue: string;
  onInputChange: (value: string) => void;
  options: OptionsType;
  isLoading?: boolean;
  onSelect: (option: OptionType) => void;
};

function Autocomplete({
  inputValue,
  onInputChange,
  options = [],
  onSelect,
  isLoading = false,
}: Props) {
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().startsWith(inputValue.toLowerCase())
      ),
    [options, inputValue]
  );
  const showEmpty = filteredOptions.length === 0 && !isLoading;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const optionsRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    setIsOpen(false);
  });

  function handleSelect(option: OptionType) {
    onSelect(option);
    onInputChange(option.label);
    setIsOpen(false);
    setSelectedIndex(0);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      setSelectedIndex(
        (selectedIndex - 1 + filteredOptions.length) % filteredOptions.length
      );
      optionsRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((selectedIndex + 1) % filteredOptions.length);
      optionsRef.current?.focus();
    } else if (e.key === "Enter") {
      handleSelect(filteredOptions[selectedIndex]);
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        className={styles.input}
        type="text"
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setIsOpen(true);
          }
          onInputChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      {isOpen && (
        <ul
          className={styles.options}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={optionsRef}
        >
          {filteredOptions.map((option, index) => {
            const highlightPart = option.label.substring(0, inputValue.length);
            const anotherPart = option.label.substring(inputValue.length);
            return (
              <li
                key={option.label}
                tabIndex={0}
                className={[
                  styles.option,
                  index === selectedIndex ? styles.selected : "",
                ].join(" ")}
                onClick={() => handleSelect(option)}
                onFocus={() => setSelectedIndex(index)}
              >
                <span className={styles.highlight}>{highlightPart}</span>
                {anotherPart}
              </li>
            );
          })}
          {isLoading && <li className={styles.empty}>Loading ... </li>}
          {showEmpty && <li className={styles.empty}>No results</li>}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
