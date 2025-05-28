import "./CSS/style.css"

const Button = ({ texto, onClick, disabled }) => {
  return (
    <button 
      className="button" 
      onClick={onClick}
      disabled={disabled}
    >
      {texto}
    </button>
  );
};
export default Button;
