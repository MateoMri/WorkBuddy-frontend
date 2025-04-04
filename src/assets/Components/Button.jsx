import "./CSS/style.css"
import { useNavigate } from 'react-router-dom';

const Button = ({ texto, onClick }) => {
  return (
    <button class="button" onClick={onClick}>{texto}</button>
  );
};
export default Button;
