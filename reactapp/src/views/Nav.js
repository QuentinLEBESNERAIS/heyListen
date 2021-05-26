import React,{useEffect,useState} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {Avatar,Menu,Badge} from 'antd';


function Nav(props) {
  const [listenToDo,setListenToDo] = useState(false)
  
  const { SubMenu } = Menu;
// ----- Affichage du badge dans faire mon Listen de la navbar
  useEffect( async () => {
        var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
        var foundListen = await rawResponse.json();
        if (foundListen.listenToDo){
        setListenToDo(true)
    }
    },[])

  useEffect(()=>{
  },[props.user])
 
  var badgeListenToDo
  if(listenToDo===false){badgeListenToDo={display:"none"}}
 
  //----Redirection si le store est vide pour empecher de taper l'url directement
  if(!props.user.email){return (<Redirect to='/'/>)}

  if(props.user.type==="manager"){ 
    return (
      <Menu mode="horizontal" className="navbar">
        <img src={'./logo-transparent.png'} className='navLogo'></img>
        <Menu.Item key="équipe">
          <Link to="/dashboard" >Mon équipe</Link>
        </Menu.Item>
        <Menu.Item key="historique">
          <Link to="/historique-manager" >Historique</Link>
        </Menu.Item>
        <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
          icon={<Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
        >
          <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
          <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  } else {
    return (
      <Menu mode="horizontal" className="navbar">
        <Link to="/dashboard-collab" ><img src={'./logo-transparent.png'} className='navLogo'></img></Link>
        <Menu.Item key="menu" >
          <Badge>
            <Link to="/dashboard-collab">Menu principal</Link>
          </Badge>
        </Menu.Item>
        <Menu.Item disabled={!listenToDo} key="listen" >
          <Badge dot style={badgeListenToDo} >
            <Link to="/listen" >Faire mon Listen</Link>
          </Badge>
        </Menu.Item>
        
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar className='avatarCollab' size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
          >
            <Menu.Item key="déconnexion" onClick={() => props.handleClickLogOut()}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
          </SubMenu>
      </Menu>
    )
  };
}

function mapDispatchToProps(dispatch){
  return {
    handleClickLogOut: function(){
      dispatch({type:"logOut"})
    }
  }
}

function mapStateToProps(state){
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);