import "./CSS/style.css"

const TextField = ({hint,type}) => {
    return(
        <input type={type} class="textField" placeholder={hint}></input>
    )
}
export default TextField