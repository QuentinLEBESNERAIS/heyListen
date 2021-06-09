import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Card,Col, Input, Row, Alert, Space, Button, message} from 'antd';
import {Link,Redirect} from 'react-router-dom';
import login2 from '../Login2.svg'

function ScreenSignUpCollab(props) {

  const [firstName,setFirstName] = useState("")
  const [lastName,setLastName] = useState("")
  const [password,setPassword] = useState("")
  const [password2,setPassword2] = useState("")
  const [company,setCompany] = useState("")
  const [jobTitle,setJobTitle] = useState("")
  const [signUpError,setSignUpError] = useState("")
  const [userCreated,setUserCreated] = useState(false)

//Fonction gestion des infos de sing-up
  var handleClickSignUp = ()=>{
// Vérification de la validité du mot de passe
    var passwordReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i);
    var valid = passwordReg.test(password);
    if(!valid){setSignUpError("Le mot de passe est incorrect, il doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial")
    }else{
// Enregistrement des informations en bdd
      async function signUp(){
        var response = await fetch('/users/sign-up-collab',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}&lastName=${lastName}&password=${password}&password2=${password2}&company=${company}&jobTitle=${jobTitle}`
        })
        response = await response.json()
// Envoi d'un email de bienvenu   
        await fetch('/mail/activate',{
          method:"POST",
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:`email=${props.email}&firstName=${firstName}`
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
    return (<Redirect to="/dashboard-collab"/>)
  }
  return (
    <div style={{background: 'linear-gradient(180deg, #FFFFFF, #00BFA6 90%, #00a38d)', height:'100vh', minHeight: '100vh'}}>
      <Row>
        <Col span={20} offset={2} style={{marginTop:40,filter:'drop-shadow(1px 2px 5px #555555)'}}>
          <Card style={{borderRadius:80}}>
            <Row justify="center" align="middle" style={{height:'20%'}}>
              <Col span={16}>
                <Alert style={{borderRadius: '5px'}} message="Bienvenu(e) ! Veuillez remplir les informations ci-dessous pour vous inscrire." type="success" action={
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
                <img src={login2} width={400}/>
              </Col>
              <Col span={16}>
                <div style={{color:'red'}}>
                  {alerte}
                </div>
                <h3 style={{marginTop:50}}>Mes informations personnelles</h3>
                <div className="sign-up-input-group"> 
                  <Input rules={[{ required: true, message: 'Please input your username!' }]} value={lastName} onChange={(e)=>setLastName(e.target.value)} className="sign-up-inputs2 sign-up-top-input-width" placeholder="Nom" />
                  <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="sign-up-inputs2 sign-up-top-input-width" placeholder="Prénom" />
                </div>
                <div className="sign-up-input-group"> 
                  <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)} className="sign-up-inputs2 sign-up-top-input-width" placeholder="Mot de passe" />
                  <Input.Password value={password2} onChange={(e)=>setPassword2(e.target.value)} className="sign-up-inputs2 sign-up-top-input-width" placeholder="Confirmation du mot de passe"/>
                </div>
                <div>
                  <Input value={company} onChange={(e)=>setCompany(e.target.value)} className="sign-up-inputs2 sign-up-bottom-input-width" placeholder="Entreprise" />
                </div>
                <div>
                  <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} className="sign-up-inputs2 sign-up-bottom-input-width" placeholder="Intitulé du poste" />
                </div>
                <Button onClick={()=>handleClickSignUp()} style={{marginLeft:'580px', borderColor:'#84CD98', color:'#84CD98',borderRadius:10,filter:'drop-shadow(1px 1px 1px #84CD98)'}}>S'inscrire</Button>
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

export default connect(mapStateToProps,mapDispatchToProps)(ScreenSignUpCollab)