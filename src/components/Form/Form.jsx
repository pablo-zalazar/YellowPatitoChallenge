import Style from "./form.module.css";

function Form({ channel, data, handleChange }) {
  console.log(data);
  return (
    <div>
      <form>
        <div className={Style.productRow}>
          <label>{data.id}</label>
          <input disabled value={data.name} />

          <div>
            <div className={Style.values}>
              <p>$</p>
              <input type="number" value={data.value} onChange={(e) => handleChange(e, channel, data.id, "value")} />
            </div>
            <div className={Style.values}>
              <input type="number" value={data.percentage} onChange={(e) => handleChange(e, channel, data.id, "percentage")} />
              <p>%</p>
            </div>
          </div>

          {data.months.map((month, index) => (
            <div className={Style.month} key={index}>
              <h5>{month.name}</h5>
              <label>$ {month.value}</label>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
export default Form;
