export const useInputsChange = (e, setInputError, setInputs, oneInput = false) => {
    setInputError(false)

    if (e.target.value.charAt(0) === ' ') {
        e.target.value = ''
    }

    if (oneInput) {
        setInputs(e.target.value)
    } else {
        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }
}