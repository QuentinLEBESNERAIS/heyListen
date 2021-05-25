import React,{useState,useEffect} from 'react';
import '../App.css';
import {Divider,Button,Card,Row,Col,Menu,Space,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover,Search} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import opinions from '../post.svg'
import reading from '../reading.svg'
import searching from '../searching.svg'

function ScreenDashboardCollab(props) {

    const [visible4, setVisible4] = useState(false);
    const [seeListen,setSeeListen] = useState({reponse1: "", reponse2: "", reponse3: "", reponse4: "", reponse5: ""})
    const [seeFeedback,setSeeFeedback] = useState({feedback1: "", feedback2: ""})
    const [seeMood,setSeeMood] = useState(0)
   
    const [listenToDo,setListenToDo] = useState(false)
    const [listenToSee,setListenToSee] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)

    const { SubMenu } = Menu;
    var styleListenToDo;
    var styleListenToSee;

    useEffect( async () => {
            var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
            var foundListen = await rawResponse.json();
            console.log("finListenResponse", foundListen)
            if (foundListen.listenToDo){
            setListenToDo(true)
            }
            if (foundListen.listenToSee){
            setListenToSee(true)  
            } 
            setPageLoaded(true)      
        }, [])

        useEffect( async () => {
            var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
            var foundListen = await rawResponse.json();
            console.log("finListenResponse", foundListen)
            if (foundListen.listenToDo){
            setListenToDo(true)
            }
            if (foundListen.listenToSee){
            setListenToSee(true)  
            } 
            setPageLoaded(true)    
        }, [listenToDo])

    useEffect(()=>{
    },[props.user])

    if (listenToDo) {
        styleListenToDo = (<Link to="/listen" >
          <Card
        hoverable
        style={{ filter:'drop-shadow(1px 1px 3px #555555)',marginTop:22, borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}
        cover={<img alt="example" src={opinions}/>}
      >
        <Card.Meta title="Faire mon listen"  />
      </Card>,
        </Link>)
    } else {
      styleListenToDo =(<Card
      style={{backgroundColor:'#DDDDDD', filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}
      cover={<img alt="example" src={opinions}/>}
    >
      <Card.Meta description="Faire mon listen"  />
    </Card>)
    }

    if (listenToSee) {
        styleListenToSee = (<Card hoverable onClick={async() => {await getSeeListen(props.user._id);showModal4()}} 
        style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}
        cover={<img alt="example" src={reading}/>}>
        <Card.Meta title="Voir mon listen"  />
       </Card>)
    } else {
        styleListenToSee = (<Card 
        style ={{backgroundColor:'#DDDDDD',filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}
        cover={<img alt="example" src={reading}/>}>
        <Card.Meta description="Voir mon listen"  />
       </Card>)
    }

    const showModal4 = () => {
        setVisible4(true);
    };

    var getSeeListen = async (value) => {
        var Response = await fetch(`/see-listen?collab=${value}`);
        var listens = await Response.json();
        setSeeListen(listens.answers)
        setSeeFeedback(listens.feedbacks)
        setSeeMood(listens.listenCompleted.mood)
    }

    const handleCancel4 = () => {
        setVisible4(false);
    };

    if(!props.user.email){return (<Redirect to='/'/>)}
    if(props.user.type === 'manager'){
        (<Redirect to='/dashboard'/>)
    } else {
     if (pageLoaded){
      return (
    <div style={{background: `linear-gradient(180deg, #FFFFFF, #00BFA6 90%, #00a38d)`,height:'100vh', width:'100vw'}}>
              <Menu mode="horizontal" className="navbar">
       <img src={'./logo-transparent.png'} className='navLogo'></img>
       <span style={{marginLeft:'6px'}}>Hey Listen ! </span>
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar style={{backgroundColor: '#f9fafd', color:'#00BFA6', border:'1px solid #00BFA6'}} size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
          >
            <Menu.Item key="déconnexion" onClick={() => {props.handleClickLogOut()}}>Me déconnecter</Menu.Item>
            <Menu.Item key="informations personnelles"><Link to="/informations-personnelles">Informations personnelles</Link></Menu.Item>
          </SubMenu>
      </Menu>

      <Row gutter={[20, 24]} justify='center' align= 'middle' style={{height:'75%', width:'100%'}}>
        <Col span={6}>
       {styleListenToDo}
       </Col>
        <Col span={6}>
        {styleListenToSee}
       </Col>
        <Col span={6}>
        <Link to="/historique-collab" >
        <Card hoverable 
        style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}
        cover={<img alt="example" src={searching}/>}>
        <Card.Meta title="Historique"  />
       </Card>
       </Link>
       </Col>
       
      </Row>
      <Modal className='center' style={{borderRadius:100}} width= {1200} height= {900} visible={visible4} footer={null} onCancel={handleCancel4}>
                    <Row>
                    <Col span={6} offset={1}>
                    <h3 style={{color:'#00BFA6'}}>Votre feedback</h3>
                    <Divider/>
                    </Col>
                    <Col span={14} offset={2}>
                    <h3 style={{color:'#00BFA6'}}>Son Listen</h3>
                    <Divider/>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={7} offset={1}>
                    
                    <h4>Qu'avez-vous pensé de la performance de ce collaborateur ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeFeedback.feedback1}</p>
                    <h4>Qu'attendez-vous de ce collaborateur pour le mois prochain ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeFeedback.feedback2}</p>
                    </Col>
                    <Col span={7} offset={1}>
                    
                    <h4>Humeur : {seeMood}</h4>
                    
                    <h4 >Les points positifs de la période:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse1}</p>
                    <h4>Quelles ont été les difficultés de la période ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse2}</p>
                    
                    <h4>Mon objectif prioritaire pour le mois prochain:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse3}</p>
                    </Col>
                    <Col span={7} offset={1}> 
                    <h4>Qu'attends-je de mon manager pour le mois prochain ?</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse4}</p>
                    <h4>Un point sur lequel j'aimerais revenir:</h4>
                    <p style={{color:'#00BFA6'}}>{seeListen.reponse5}</p>
                    </Col>
                    </Row>
                </Modal>
    </div>
    );
} else {
    return (
        <Row justify="center" align="middle" style={{height:'100vh'}}>
            <Col ><img src='./Spinner-1s-200px-vert.gif'/></Col>
        </Row>
   )
    }
}
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
)(ScreenDashboardCollab);

