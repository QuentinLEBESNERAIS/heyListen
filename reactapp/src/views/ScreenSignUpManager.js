import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Card,Col, Input, Row, Alert, Space, Button,message} from 'antd';
import {Link,Redirect} from 'react-router-dom';
import login from '../login.svg'

function ScreenSignUpManager(props) {

  const [firstName,setFirstName] = useState("")
  const [lastName,setLastName] = useState("")
  const [password,setPassword] = useState("")
  const [password2,setPassword2] = useState("")
  const [company,setCompany] = useState("")
  const [jobTitle,setJobTitle] = useState("")
  const [signUpError,setSignUpError] = useState("")
  const [userCreated,setUserCreated] = useState(false)

// Fonction gestion des informations du sign-up
  var handleClickSignUp = ()=>{
// Vérification de la validité du mot de passe
    var passwordReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i);
    var valid = passwordReg.test(password);
    if(!valid){setSignUpError("Le mot de passe est incorrect, il doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial")
    } else {
// Enregistrement des informations en bdd
      async function signUp(){
        var response = await fetch('/users/sign-up-manager',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        response=await response.json()  
// Envoi d'un email de bienvenu  
        await fetch('/mail/welcome',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        setSignUpError(response.response)
        if(response.user)
        {props.userToReducer(response.user)
        if(response.response==="compte crée"){
          setUserCreated(true)
          const info = () => {
            message.info('Compte crée avec succès');
          }
          info();}}
      }
      signUp()
    }
  }

//Alerte sign-up
  let alerte 
  if(signUpError){alerte=<Alert style={{borderRadius: '5px'}}
  message={signUpError}
  type="error"
  closable
  />}

  if(userCreated){
    return <Redirect to="/dashboard"/>
  }
  return (
    <div style={{background: 'linear-gradient(180deg, #007DB3, #005295 50%, #003376)', height:'100vh', minHeight: '100vh'}}>
      <Row>
        <Col span={20} offset={2} style={{marginTop:45,filter:'drop-shadow(1px 2px 5px #555555)'}}>
          <Card style={{borderRadius:80}}>
            <Row justify="center" align="middle" style={{height:'20%'}}>
              <Col span={16}>
                <Alert style={{borderRadius: '5px'}} message="Bienvenu(e) ! Veuillez remplir les informations ci-dessous pour vous inscrire." type="info" action={
                  <Space>
                    <Link to={'/'}>
                    <Button size="small" type="ghost">
                      Je suis déjà inscrit(e)
                    </Button>
                    </Link>
                  </Space>
                } closable/>
              </Col>
            </Row>
            <Row justify="center" align="top">
              <Col span={8} >
                <img src={login} width={400}/>
              </Col>
              <Col span={16}>
                <div style={{color:'red'}}>
                {alerte}
                </div>
                <h3 style={{marginTop:50}}>Mes informations personnelles</h3>
                <div className="sign-up-input-group"> 
                  <Input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Nom" />
                  <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Prénom" />
                </div>
                <div className="sign-up-input-group"> 
                  <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Mot de passe" />
                  <Input.Password value={password2} onChange={(e)=>setPassword2(e.target.value)} className="sign-up-inputs sign-up-top-input-width" placeholder="Confirmation du mot de passe" />
                </div>
                <div>
                  <Input value={company} onChange={(e)=>setCompany(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Entreprise" />
                </div>
                <div>
                  <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} className="sign-up-inputs sign-up-bottom-input-width" placeholder="Intitulé du poste" />
                </div>
                <Button onClick={()=>handleClickSignUp()} style={{marginTop:'30px',marginLeft:'580px',borderColor:'#003566', color:'#003566',borderRadius:10,filter:'drop-shadow(1px 1px 1px #003566)'}}>S'inscrire</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    userToReducer: function(user){
      dispatch({type:"logUser",user})
    }
  }
}

function mapStateToProps(state){
  return {email:state.email}
}

export default connect(mapStateToProps,mapDispatchToProps)(ScreenSignUpManager)