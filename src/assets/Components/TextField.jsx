import "./CSS/style.css"

const TextField = ({ hint, type, value, onChange }) => {
    return(
        <input 
            type={type} 
            className="textField" 
            placeholder={hint}
            value={value || ""}
            onChange={onChange}
        />
    )
}

export default TextField