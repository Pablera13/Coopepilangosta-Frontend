import PropTypes from "prop-types";
import MenuItems from "./MenuItems";

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";

  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  );
};

Dropdown.propTypes = {
  submenus: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      submenu: PropTypes.array,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  dropdown: PropTypes.bool.isRequired,
  depthLevel: PropTypes.number.isRequired,
};

export default Dropdown;