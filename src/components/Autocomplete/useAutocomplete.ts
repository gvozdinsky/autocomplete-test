import { useEffect, useRef, useState } from "react";
import { OptionsType } from "./types";

export default function useAutocomplete({
  loadOptions,
}: {
  loadOptions?: ({
    inputValue,
  }: {
    inputValue: string;
  }) => Promise<OptionsType>;
} = {}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionsType>([]);
  const loadOptionsRef = useRef(loadOptions);

  useEffect(() => {
    if (!loadOptionsRef.current) {
      return;
    }

    let didCancel = false;
    if (inputValue.length === 0) {
      setOptions([]);
      return;
    }

    async function run() {
      if (loadOptionsRef?.current) {
        setIsLoading(true);
        const items = await loadOptionsRef.current({ inputValue });
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
  }, [inputValue]);

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
