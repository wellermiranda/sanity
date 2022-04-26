import {TextArea, Theme} from '@sanity/ui'
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react'
import styled, {css} from 'styled-components'
import {FormInputComponentResolver, InputProps} from '../../../../types'
import {PatchEvent, set} from '../../../../patch'

const DebugTextArea = styled(TextArea)(({theme}: {theme: Theme}) => {
  return css`
    font-family: ${theme.sanity.fonts.code.family};
  `
})

const DebugInput = forwardRef(function DebugInput(props: InputProps, ref) {
  const {onChange, inputProps} = props
  const {onBlur, onFocus, readOnly} = inputProps

  const rootRef = useRef<HTMLTextAreaElement | null>(null)

  useImperativeHandle(ref, () => ({
    blur: () => rootRef.current?.blur(),
    focus: () => rootRef.current?.focus(),
  }))

  const handleChange = useCallback(() => {
    onChange(PatchEvent.from(set({})))
  }, [onChange])

  return (
    <DebugTextArea
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={onFocus}
      padding={3}
      radius={1}
      readOnly={readOnly}
      ref={rootRef}
      rows={100}
      value={JSON.stringify(props.value, null, 2)}
    />
  )
})

export const resolveInputComponent: FormInputComponentResolver = () => {
  return DebugInput
}

export const resolvePreviewComponent = () => {
  return function PreviewAny() {
    return <div>preview</div>
  }
}
