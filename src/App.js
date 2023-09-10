import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";

const App = () => {
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    product: "",
    model: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://62f27b4218493ca21f34beae.mockapi.io/products"
      );
      console.log(response.data);
      setProductData(response.data);
    };
    getData();
  }, []);

  const handleValidate = (formDataToValidate) => {
    var error = {};
    if (formDataToValidate.product === "")
      error.product = "Enter a  Product Name";
    if (formDataToValidate.model === "") error.model = "Enter a  Model";
    if (formDataToValidate.price === "") error.price = "Enter a  Price";
    if (formDataToValidate.quantity === "")
      error.quantity = "Enter a  Quantity";
    return error;
  };

  const handleSubmit = async (formSubmittedData, { resetForm }) => {
    if (formData.id) {
      // Update data
      const response = await axios.put(
        `https://62f27b4218493ca21f34beae.mockapi.io/products/${formData.id}`,
        { ...formSubmittedData }
      );
      let update = [...productData];
      let index = productData.findIndex((row) => row.id === formData.id);
      update[index] = response.data;
      setProductData(update);
      resetForm();
    } else {
      // Create new data
      const response = await axios.post(
        "https://62f27b4218493ca21f34beae.mockapi.io/products",
        { ...formSubmittedData }
      );
      setProductData([...productData, response.data]);
      resetForm();
    }
  };
  const onPopulateData = (id) => {
    const selectedData = productData.filter((row) => row.id === id)[0];
    setFormData({ ...selectedData });
  };

  // delete data
  const handleDelete = async (id) => {
    let confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirm) {
      const response = await axios.delete(
        `https://62f27b4218493ca21f34beae.mockapi.io/products/${id}`
      );
      const unDeletedData = productData.filter((row) => row.id !== id);
      setProductData(unDeletedData);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <h2 style={{ color: "white" }}>infofix </h2>
        </div>
      </nav>

      {/* Form */}
      <div className="container">
        <h2 className="my-2">Product List</h2>

        {/* Form validation using formik */}
        <Formik
          initialValues={formData}
          validate={handleValidate}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            resetForm,
          }) => (
            //Created form using Material UI
            <Box
              className="box"
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                sx={{
                  "& > :not(style)": { m: 1, width: 400, maxWidth: "100%" },
                }}
                id="product"
                type="text"
                label="Product Name"
                variant="outlined"
                value={values.product}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span style={{ color: "red" }}>
                <p>{touched.product && errors.product}</p>
              </span>
              <TextField
                sx={{
                  "& > :not(style)": { m: 1, width: 400, maxWidth: "100%" },
                }}
                id="model"
                type="text"
                label="Model"
                variant="outlined"
                value={values.model}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span style={{ color: "red" }}>
                <p>{touched.model && errors.model}</p>
              </span>
              <TextField
                sx={{
                  "& > :not(style)": { m: 1, width: 400, maxWidth: "100%" },
                }}
                id="price"
                type="number"
                label="Price"
                variant="outlined"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p>
                <span style={{ color: "red" }}>
                  {touched.price && errors.price}
                </span>
              </p>
              <TextField
                sx={{
                  "& > :not(style)": { m: 1, width: 400, maxWidth: "100%" },
                }}
                id="quantity"
                type="number"
                label="Quantity"
                variant="outlined"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span style={{ color: "red" }}>
                <p>{touched.quantity && errors.quantity}</p>
              </span>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>{" "}
              &nbsp;
              <Button variant="contained" onClick={resetForm}>
                Reset
              </Button>
            </Box>
          )}
        </Formik>


        {/* Table */}
        <p className="my-3"></p>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  className="text-secondary fw-bolder fs-6"
                >
                  Id
                </TableCell>
                <TableCell
                  align="center"
                  className="text-primary fw-bolder fs-6"
                >
                  Product Name
                </TableCell>
                <TableCell
                  align="center"
                  className="text-primary fw-bolder fs-6"
                >
                  Model
                </TableCell>
                <TableCell
                  align="center"
                  className="text-primary fw-bolder fs-6"
                >
                  Price
                </TableCell>
                <TableCell
                  align="center"
                  className="text-primary fw-bolder fs-6"
                >
                  Quantity
                </TableCell>
                <TableCell
                  align="center"
                  className="text-secondary fw-bolder fs-6"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align="center">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.product}</TableCell>
                  <TableCell align="center">{row.model}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.quantity}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => onPopulateData(row.id)}
                    >
                      Edit
                    </Button>{" "}
                    &nbsp;
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default App;
