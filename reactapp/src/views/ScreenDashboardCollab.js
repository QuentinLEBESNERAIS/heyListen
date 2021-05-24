import React,{useState,useEffect} from 'react';
import '../App.css';
import {Divider,Button,Card,Row,Col,Menu,Space,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message, Popconfirm,Popover,Search} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined, DeleteOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

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
        styleListenToDo = (<Link to="/listen" ><Card hoverable style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EditOutlined style={{ fontSize: '70px', color: '#59886b'}} />
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Faire mon listen</div>
        </Card></Link>)
    } else {
        styleListenToDo = (<Card  style ={{filter:'drop-shadow(1px 1px 3px #555555)',backgroundColor:'#dddddd', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EditOutlined style={{ fontSize: '70px', color: '#e8e8e8'}} />
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px', color:'#aaaaaa'}}>Faire mon listen</div>
        </Card>)
    }

    if (listenToSee) {
        styleListenToSee = (<Card hoverable onClick={async() => {await getSeeListen(props.user._id);showModal4()}} style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EyeOutlined style={{ fontSize: '70px', color: '#59886b'}}/>
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Voir mon listen</div>
       </Card>)
    } else {
        styleListenToSee = (<Card style ={{filter:'drop-shadow(1px 1px 3px #555555', backgroundColor:'#dddddd', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <EyeOutlined style={{ fontSize: '70px', color: '#e8e8e8'}}/>
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px', color:'#aaaaaa'}}>Voir mon listen</div>
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
    

    const handleOk4 =  () => {
        setVisible4(false);
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
    <div style={{backgroundColor:'#c6ebc9',height:'100vh', width:'100vw'}}>
              <Menu mode="horizontal" className="navbar">
       <img src={'./logo-transparent.png'} className='navLogo'></img>
       <span style={{marginLeft:'6px'}}>Hey Listen ! </span>
          <SubMenu style={{position:'absolute', top:'0', right:'0'}} key="SubMenu" 
            icon={<Avatar className="avatar" size={33}>{props.user.firstName[0]}{props.user.lastName[0]}</Avatar>}
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
        <Card hoverable style ={{filter:'drop-shadow(1px 1px 3px #555555)', borderRadius:10, height: '250px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <HistoryOutlined style={{ fontSize: '70px', color: '#59886b'}}/>
        <div style={{textAlign:'center', fontSize: '25px', marginTop:'13px'}}>Historique</div>
       </Card>
       </Link>
       </Col>
      </Row>
      <Modal width= {1200} height= {900} visible={visible4} footer={null} onCancel={handleCancel4}>
                    <Row>
                    <Col span={6} offset={1}>
                    <h3 style={{color:'#59886b'}}>Votre feedback</h3>
                    <Divider/>
                    </Col>
                    <Col span={14} offset={2}>
                    <h3 style={{color:'#59886b'}}>Son Listen</h3>
                    <Divider/>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={7} offset={1}>
                    
                    <h4>Qu'avez-vous pensé de la performance de ce collaborateur ?</h4>
                    <p style={{color:'#59886b'}}>{seeFeedback.feedback1}</p>
                    <h4>Qu'attendez-vous de ce collaborateur pour le mois prochain ?</h4>
                    <p style={{color:'#59886b'}}>{seeFeedback.feedback2}</p>
                    </Col>
                    <Col span={7} offset={1}>
                    
                    <h4>Humeur : {seeMood}</h4>
                    
                    <h4 >Les points positifs de la période:</h4>
                    <p style={{color:'#59886b'}}>{seeListen.reponse1}</p>
                    <h4>Quelles ont été les difficultés de la période ?</h4>
                    <p style={{color:'#59886b'}}>{seeListen.reponse2}</p>
                    
                    <h4>Mon objectif prioritaire pour le mois prochain:</h4>
                    <p style={{color:'#59886b'}}>{seeListen.reponse3}</p>
                    </Col>
                    <Col span={7} offset={1}> 
                    <h4>Qu'attends-je de mon manager pour le mois prochain ?</h4>
                    <p style={{color:'#59886b'}}>{seeListen.reponse4}</p>
                    <h4>Un point sur lequel j'aimerais revenir:</h4>
                    <p style={{color:'#59886b'}}>{seeListen.reponse5}</p>
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

