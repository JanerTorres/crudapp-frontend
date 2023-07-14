import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Component } from 'react';

const apiUrl = "http://localhost:8080/crudapp";

class App extends Component {

  state = {
    data: [],
    modalAgregar: false,
    modalEliminar: false,
    form: {
      id: '',
      name: '',
      description: '',
      price: '',
      tipoModal: ''
    },
    isValidPrice: true
  }

  getProducts = () => {
    axios.get(apiUrl + "/product/getall").then(response => {
      this.setState({ data: response.data });
    })
  }


  createProduct = async () => {
    await axios.post((apiUrl + "/product/create"), this.state.form).then(
      response => {
        this.modalAgregar();
        this.getProducts();
      }
    ).catch(error => {
      console.log(error.message);
    })
  }

  updateProduct = () => {
    axios.put((apiUrl + "/product/update/" + this.state.form.id), this.state.form).then(response => {
      this.modalAgregar();
      this.getProducts();
    })
  }
  
  deleteProduct = () => {
    axios.delete(apiUrl + "/product/" + this.state.form.id).then(response => {
      this.setState({modalEliminar: false});
      this.getProducts();
    })
  }

  selectProduct=(product)=>{
    this.setState({
      tipoModal: 'update',
      form: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price
      }
    })
  }

  modalAgregar = () => {
    this.setState({ modalAgregar: !this.state.modalAgregar });
  }

  handleChange = async (e) => {
    e.persist();
    const { name, value } = e.target;
    if (name === 'price') {
      const regex = /^\d+(\.\d{0,3})?$/;
      const isValid = regex.test(value);
      await this.setState(prevState => ({
        form: { ...prevState.form, [name]: value },
        isValidPrice: isValid
      }));
    } else {
      await this.setState(prevState => ({
        form: { ...prevState.form, [name]: value }
      }));
    }
    console.log(this.state.form);
  }
  

  componentDidMount() {
    this.getProducts();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="CrudApp main ">
        <div className='title'><h1>Aplicación Crud de Productos</h1></div>
        <br />
        <button className="btn btn-success btn-add" onClick={() => {this.setState({form: null, tipoModal: 'agregar'}); this.modalAgregar()}}>Agregar Producto</button>
        <br /> <br />
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio (COP)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(product => {
              return (
                <tr>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{new Intl.NumberFormat("en-EN").format(product.price)}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>{this.selectProduct(product); this.modalAgregar()}}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={()=>{this.selectProduct(product); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalAgregar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form ? form.name : '' } />
              <br />
              <label htmlFor="description">Descripción</label>
              <input className="form-control" type="text" name="description" id="description" onChange={this.handleChange} value={form ? form.description : ''} />
              <br />
              <label htmlFor="price">Precio (usar punto (.) como decimal)</label>
              <input className={`form-control ${this.state.isValidPrice ? '' : 'is-invalid'}`} type="text" name="price" id="price" onChange={this.handleChange} value={form ? form.price : ''} />
              {!this.state.isValidPrice && <div className="invalid-feedback">Ingresa un precio válido</div>}

            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModal=='agregar' ?
            <button className='btn btn-success' onClick={() => this.createProduct()}>Agregar</button> :
            <button className='btn btn-success' onClick={() => this.updateProduct()}> Actualizar</button>
          }
            <button className='btn btn-danger' onClick={() => this.modalAgregar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Está seguro que desea eliminar el producto {form && form.name}?
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-danger' onClick={() => this.deleteProduct()}>Sí</button>
            <button className='btn btn-secundary' onClick={() => this.setState({modalEliminar: false})}>Volver</button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}
export default App;
