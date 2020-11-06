import React from "react"

export function useInput<T>(
  initialValue: T
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  React.ChangeEventHandler<HTMLInputElement>
] {
  const [value, setValue] = React.useState(initialValue)

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      setValue((event.target.value as unknown) as T)
    },
    [setValue]
  )

  return [value, setValue, handleChange]
}
