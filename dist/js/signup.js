function Signup() {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const data = {
        nombre,
        telefono,
        correo,
        password
      };
  
      fetch('https://fut7montessori.com.mx/model/cliente.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        navigate('/pages/signin')
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
}