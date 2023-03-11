import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "./app.module.css";
import Form from "./components/Form/Form";

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "Junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "Noviembre",
  "diciembre",
];

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  console.log(countries);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://18.220.234.192:4000/api/users/64040284d9a91413da049e67");
      const { productos, paises, canales } = data.response.assumptionData[0];
      let newCountriesArray = [];
      paises.forEach((pais) => {
        const resp = { name: pais.value, channels: [] };
        resp.channels = canales.map((canal) => {
          const channels = { name: canal.name, products: [] };
          channels.products = productos.map((product) => {
            const products = { id: product.id, name: product.name, value: 0, percentage: 0, months: [] };
            products.months = months.map((month) => {
              return { name: month, value: 0 };
            });
            return products;
          });
          return channels;
        });
        newCountriesArray = [...newCountriesArray, resp];
      });

      setCountries(newCountriesArray);
    })();
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("asdasdasd");
  }, [countries]);

  const handleSelectCountry = (value) => {
    const data = countries.filter((country) => country.name === value);
    setSelectedCountry(data[0]);
  };

  const handleChange = (e, channelName, id, prop) => {
    const newCountries = countries.map((country) => {
      if (country.name === selectedCountry.name) {
        const channels = country.channels.map((channel) => {
          if (channel.name === channelName) {
            const products = channel.products.map((product) => {
              if (product.id === id) {
                product[prop] = e.target.value;
              }
              return product;
            });
            return { ...channel, products };
          } else return channel;
        });
        return { ...country, channels };
      } else return country;
    });
    setCountries(newCountries);
  };

  const calculatePercentages = (value, percentage, months) => {
    let newArray = [];
    months.forEach((month, index) => {
      if (index === 0) {
        newArray = [...newArray, { name: month.name, value }];
      } else {
        const newValue = newArray[index - 1].value + (newArray[index - 1].value * percentage) / 100;
        newArray = [...newArray, { name: month.name, value: Math.floor(newValue) }];
      }
    });
    return newArray;
  };

  const handleSubmit = () => {
    let emptyValues = false;
    const newCountries = countries.map((country) => {
      const channels = country.channels.map((channel) => {
        const products = channel.products.map((product) => {
          if (product.value !== "" && product.percentage !== "" && product.value >= 0 && product.percentage >= 0) {
            const months = calculatePercentages(parseFloat(product.value), parseFloat(product.percentage), product.months);
            return { ...product, months };
          } else {
            emptyValues = true;
            return { ...product, value: 0, percentage: 0, months: product.months };
          }
        });
        return { ...channel, products };
      });
      return { ...country, channels };
    });
    setCountries(newCountries);
    setSelectedCountry(newCountries.filter((country) => country.name === selectedCountry.name)[0]);
    if (emptyValues) {
      toast.error("Solo se permiten valores positivos", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <header>
        <h1>Precio (P)</h1>
        <p>Plan de ventas</p>
      </header>

      <main>
        {loading ? (
          <p>Cargando</p>
        ) : (
          <div className={Style.container}>
            <h3>Carga de productos / servicios</h3>
            <div className={Style.countries}>
              {countries.map((country) => (
                <button
                  key={country.name}
                  className={selectedCountry?.name === country.name ? Style.selectedCountry : ""}
                  onClick={() => handleSelectCountry(country.name)}
                >
                  {country.name}
                </button>
              ))}
            </div>
            {selectedCountry && (
              <div className={Style.data}>
                {selectedCountry.channels.map((channel, index) => (
                  <div className={Style.channel} key={index}>
                    <h2>{channel.name}</h2>
                    {channel.products.map((product, index) => (
                      <Form channel={channel.name} data={product} handleChange={handleChange} key={index} />
                    ))}
                  </div>
                ))}
                <button onClick={handleSubmit}>Cargar datos</button>
              </div>
            )}
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
