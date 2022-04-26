import React, {useMemo} from 'react'
import {isValidationErrorMarker} from '@sanity/types'
import {TextInput} from '@sanity/ui'
import {useId} from '@reach/auto-id'
import {FormField} from '../../components/formField'
import {PatchEvent, set, unset} from '../patch'
import {getValidationRule} from '../utils/getValidationRule'
import {NumberInputProps} from '../types'
// import {NumberInputProps} from '../types'

// export type NumberInputProps = NumberInputProps

export const NumberInput = React.forwardRef(function NumberInput(
  props: NumberInputProps,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) {
  const {inputProps, value = '', validation, type, level, onChange, presence} = props
  const {onFocus, readOnly} = inputProps
  const errors = useMemo(() => validation.filter(isValidationErrorMarker), [validation])
  const id = useId()

  // Show numpad on mobile if only positive numbers is preferred
  const minRule = getValidationRule(type, 'min')
  const onlyPositiveNumber = (minRule?.constraint || 0) >= 0

  const handleChange = React.useCallback(
    (event: React.SyntheticEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value
      onChange(PatchEvent.from(nextValue === '' ? unset() : set(Number(nextValue))))
    },
    [onChange]
  )

  return (
    <FormField
      level={level}
      validation={validation}
      title={type.title}
      description={type.description}
      inputId={id}
      __unstable_presence={presence}
    >
      <TextInput
        type="number"
        step="any"
        inputMode={onlyPositiveNumber ? 'numeric' : 'text'}
        id={id}
        customValidity={errors && errors.length > 0 ? errors[0].item.message : ''}
        value={value}
        readOnly={Boolean(readOnly)}
        placeholder={type.placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        ref={forwardedRef}
        pattern={onlyPositiveNumber ? '[d]*' : undefined}
      />
    </FormField>
  )
})
