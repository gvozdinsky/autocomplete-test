import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../../hooks";
import { OptionsType } from "./types";

type Params = {
  loadOptions?: ({
    inputValue,
  }: {
    inputValue: string;
  }) => Promise<OptionsType>;
  debounceDelay?: number;
};

export default function useAutocomplete({
  loadOptions,
  debounceDelay = 1000,
}: Params = {}) {
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebouncedValue(inputValue, debounceDelay);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionsType>([]);
  const loadOptionsRef = useRef(loadOptions);

  useEffect(() => {
    if (!loadOptionsRef.current) {
      return;
    }

    let didCancel = false;
    if (debouncedInputValue.length === 0) {
      setOptions([]);
      return;
    }

    async function run() {
      if (loadOptionsRef?.current) {
        setIsLoading(true);
        const items = await loadOptionsRef.current({
          inputValue: debouncedInputValue,
        });
        if (!didCancel) {
          setOptions(items);
        }
        setIsLoading(false);
      }
    }

    run();

    return () => {
      didCancel = true;
    };
  }, [debouncedInputValue]);

  function onInputChange(value: string) {
    setInputValue(value);
  }

  return {
    inputProps: {
      inputValue,
      onInputChange,
    },
    asyncOptionsLoadProps: {
      options,
      isLoading,
    },
  };
}
