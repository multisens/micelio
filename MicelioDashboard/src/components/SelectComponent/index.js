import { Select } from '@chakra-ui/react'

const SelectComponent = ({ options, setStateFunction }) => {

  return (
      <Select placeholder='Select option'>
        { options.map( (op, index) => {
          return <option 
          value={op.config} 
          key={index} 
          onChange={(e) => setStateFunction(e.target.value)}>
            {op.value}</option>
        })}
      </Select>
  )
}

export default SelectComponent;