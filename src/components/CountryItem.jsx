import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <img
        src={`https://flagcdn.com/80x60/${country.emoji}.png`}
        width="100"
        height="75"
        alt={country.emoji} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
