import React,{useState,useEffect} from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,message,Modal,Button} from 'antd'
import {StopOutlined,FrownOutlined,SmileOutlined,EyeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Nav from './Nav'
import _ from 'lodash';

function ScreenHistoriqueCollab(props) {
    const {Sider, Content} = Layout;
    const {Option} = Select;
    const [visibleModal, setVisibleModal] = useState(false);
    const [dataCollabFromBack, setDataCollabFromBack] = useState({matriochka:[{}]});
    const [year, setYear] = useState('')

//Affichage modale de rappel du listen à remplir
useEffect(() => {
    const startPage = ( async () => {
        if (props.shownModal == false){
            var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
            var foundListen = await rawResponse.json();
            if (foundListen.response == true){
            console.log('foundListen.response', foundListen.response)
            setVisibleModal(true)
            }
        }
        const data = await fetch('/test', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        })
        const body = await data.json()
        console.log(body)
        setDataCollabFromBack(body)
    })
    startPage();
    },[])

    console.log("MATRIOCHKA = ",dataCollabFromBack)
    console.log("Test 2 = ", dataCollabFromBack.matriochka)
    console.log("Test 3 = ", dataCollabFromBack.matriochka[0])

    let testDown = dataCollabFromBack.matriochka[0]

    const handleCancel = () => {
        props.modalState()
        setVisibleModal(false);
    };

    function handleChange(value) {
        console.log("year = ", year)
        setYear(value);
    }

    return (

    <div>
        <Layout style={{backgroundColor:'#FFFFFF'}}>
            <Nav/>
            <Layout style={{backgroundColor:'#FFFFFF'}}>
                <Sider style={{backgroundColor:'#D8E3E7'}}>
                    <Row>
                        <Col span={22} offset={2}>
                            <Select defaultValue="Année" style={{width: 160, marginTop:20}} onChange={handleChange}>
                            {dataCollabFromBack.matriochka.map((years, i) => (
                                <Option value={i}>{_.findKey(years)}</Option>
                            ))}
                            </Select>
                        </Col>
                    </Row>

                    <Row type="flex" align-item="center">
                        {year === "" &&
                            <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                                <Typography.Text>vide</Typography.Text>
                            </Col>
                        }    

                        {dataCollabFromBack.matriochka.map((years, i) => (
                                year === i &&
                                {
                                    dataCollabFromBack.matriochka.map((years, i) => 
                                    <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                                        <Typography.Text>TEST {_.findKey(years)}</Typography.Text>
                                        <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                                    </Col>
                                )}
                            ))}

                    </Row>
                </Sider>
                <Content>
                    <Row>
                        <Col span={24} offset={0}>
                            <div className="icon-wrapper">
                                <FrownOutlined style={{color:'#A62626'}}/>
                                <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value ="2" 
                                min={1} max={5}/>
                                <SmileOutlined style={{color:'#448f30'}}/>
                            </div>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 1</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 1" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 2</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 2" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 3</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 3" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 4</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 4" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 5</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 5" disabled="trues"/>
                        </Col>
                        <Divider>FeedBack Manager</Divider>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>FeedBack 1</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse FeedBack 1" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>FeedBack 2</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse FeedBack 2" disabled="trues"/>
                        </Col>
                    </Row>
                </Content>
                <Modal visible={visibleModal} onCancel={handleCancel} footer={<Link to="/listen" ><Button key="back" onClick={props.modalState()}>
              Remplir mon listen
            </Button></Link>} width={700} height={500}>
                <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                    Bonjour, veuillez remplir votre Listen !
                </div>

            </Modal>
            </Layout>
        </Layout>
    </div>
    );
}

function mapStateToProps(state) {
    console.log('test userStore',state.user._id)
    return { userId: state.user }
}

function mapDispatchToProps(dispatch){
    return {
      modalState: function(){
        dispatch({type:"modalState"})
      }
    }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenHistoriqueCollab);