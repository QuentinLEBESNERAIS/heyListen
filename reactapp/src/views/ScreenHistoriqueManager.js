import React,{useState,useEffect} from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,message,Modal,Button, Menu, Dropdown, Empty} from 'antd'
import {StopOutlined,FrownOutlined,SmileOutlined,EyeOutlined,DownOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import Nav from './Nav'
import _, { isArguments } from 'lodash';
import moment from 'moment';
import rafiki from '../search-rafiki.png'

function ScreenHistoriqueManager(props) {
    const {Sider, Content} = Layout;
    const {Option} = Select;
    const [visibleModal, setVisibleModal] = useState(false);
    const [myTeamFromBack, setMyTeamFromBack] = useState ([])
    const [dataCollabFromBack, setDataCollabFromBack] = useState({matriochka:[{}]});
    const [selectedCollab, setSelectedCollab] = useState('')
    const [year, setYear] = useState('')
    const [selectedListen, setSelectedListen] = useState({})
    const [firstSelectedListen, setFirstSelectedListen] = useState(true)
    const [firstSelectedCollab, setFirstSelectedCollab] = useState(true)
    const [yearDropdown, setYearDropdown] = useState("default")

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
            const data = await fetch('/find-Collab', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${props.userId._id}`
            })
            const body = await data.json()
            console.log("MyTeamFromBack = ", body.myTeam.collab)
            setMyTeamFromBack(body.myTeam.collab)
        })
        startPage();
    },[])

    async function handleChangeCollaborateur(value) {
        setYearDropdown("default")
        setFirstSelectedListen(true)
        setYear('')
        setDataCollabFromBack({matriochka:[{}]})
        setSelectedCollab(value);
        (console.log("Selected Collab ID = ", selectedCollab))
        const callMatriochka = ( async () => {
            const data = await fetch('/matriochkaCollab', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${value}`
            })
            const body2 = await data.json()
            console.log(body2)
            setDataCollabFromBack(body2)
        })
        callMatriochka();
        setFirstSelectedCollab(false)
    }

    function handleChange(value) {
        setYear(value);
    }

    function chooseListen(listen) {
        //console.log("Test choose Listen = ",listen)
        let listenTemp = listen
        setFirstSelectedListen(false)
        setSelectedListen(listenTemp)
        console.log("SELECTED LISTEN = ", selectedListen)
    }

    const menu = (i, years, o, months) => (
        <Menu>
            {dataCollabFromBack.matriochka[i][_.findKey(years)][o][_.findKey(months)][0].map((days, p) => (
                <Menu.Item key={p}>
                    <Typography.Text onClick={() => chooseListen(days)}>{moment(days.createdAt).format('DD')}/{_.findKey(months)}/{_.findKey(years)}</Typography.Text>
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleCancel = () => {
        props.modalState()
        setVisibleModal(false);
    };


    if(props.userId.type==="manager"){
        return (
            <div>
                <Layout  style={{backgroundColor:'#007DB3'}}>
                    <Nav/>
                            

                            
                                <Layout style={{marginTop:"48px", backgroundColor:'#FFFFFF',height:'100vh'}}>
                                <Sider minHeight={100} style={{backgroundColor:'#003376',height:'100vh'}}>
                                    <Row>
                                        <Col span={22} offset={2}>
                                       
                                <Select defaultValue="Collaborateur" style={{width: 160, marginTop:20}} onChange={handleChangeCollaborateur}>
                                    {myTeamFromBack.map((collab, i) => (
                                                    <Option value={collab._id}>{collab.firstName} {collab.lastName}</Option>
                                                ))}
                                </Select>
                                            {firstSelectedCollab === false &&
                                                <Select value={yearDropdown} defaultValue="Année" style={{width: 160, marginTop:20}} onChange={handleChange}>
                                                        <Option value="default" disabled>Selectioner une année</Option>
                                                    {dataCollabFromBack.matriochka.map((years, i) => (
                                                        <Option value={i}>{_.findKey(years)}</Option>
                                                    ))}
                                                </Select>
                                            }
                                            
                                        </Col>
                                    </Row>
            
                                    <Row type="flex" align-item="center">
                                        {year === "" &&
                                            <Col span={24} offset={0} style={{marginTop:20, marginBottom:20}} justify ="center" align="middle"></Col>
                                        }    


                                        {dataCollabFromBack.matriochka.map((years, i) => {
                                            if (year === i) {
                                                return dataCollabFromBack.matriochka[i][_.findKey(years)]?.map((months, o) => (
                                                    <Col span={24} offset={0} style={{marginTop:10, marginBottom:10}} justify ="center" align="middle">
                                                        <Dropdown overlay={menu(i, years, o, months)} trigger={['click']}>
                                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                                {_.findKey(months)}/{_.findKey(years)} <DownOutlined />
                                                            </a>
                                                        </Dropdown>
                                                    </Col>
                                                )) 
                                            }
                                        })}


                                    </Row>
                                </Sider>
                                <Content>
                                    {firstSelectedListen === true && 
                                    <Row>
                                        <Col span={24} offset={0} justify="center" align="middle" style={{marginTop:25}}>
                                            <Typography.Text style={{color:'black'}}> Veuillez choisir un Listen dans le menu déroulant à gauche</Typography.Text>
                                            
                                        </Col>
                                        <Col span={24} offset={0} justify="center" align="middle" style={{marginTop:25}}>
                                        <img src={rafiki} width={400}/>
                                        </Col>
                                        </Row>
                                    }
                                            
                                    {firstSelectedListen === false &&
                                            <Row>
                                            <Col span={24} offset={0} justify="center" align="middle" style={{marginTop:20}}>
                                                <Typography.Text>{moment(selectedListen.createdAt).format('DD-MM-YYYY')}</Typography.Text>
                                            </Col>
                                            <Col span={24} offset={0}>
                                                <div className="icon-wrapper">
                                                    <FrownOutlined style={{color:'#A62626'}}/>
                                                    <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value={selectedListen.mood} min={1} max={5}/>
                                                    <SmileOutlined style={{color:'#448f30'}}/>
                                                </div>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>Question 1</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse1: "Vide"} disabled="true"/>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>Question 2</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse2: "Vide"} disabled="true"/>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>Question 3</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse3: "Vide"} disabled="true"/>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>Question 4</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse4: "Vide"} disabled="true"/>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>Question 5</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse5: "Vide"} disabled="true"/>
                                            </Col>
                                            <Divider>FeedBack Manager</Divider>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>FeedBack 1</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback1: "Vide"} disabled="true"/>
                                            </Col>
                                            <Col span={22} offset={2}>
                                                <Col style={{marginBottom:4}}>
                                                    <Typography.Text>FeedBack 2</Typography.Text>
                                                </Col>
                                                <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback2: "Vide"} disabled="true"/>
                                            </Col>
                                        </Row>
                                    }
                                </Content>
                                
                                <Modal className='center' visible={visibleModal} onCancel={handleCancel} footer={<Link to="/listen" ><Button key="back" onClick={props.modalState()}>
                                    Remplir mon listen
                                    </Button></Link>} width={700} height={500}>
                                    <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                                        Bonjour, veuillez remplir votre Listen !
                                    </div>
                                </Modal>
                            </Layout>
                            
            </Layout>
            </div>
        )
    } else {
        return <Redirect to='/historique-collab'/> 
    };
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
)(ScreenHistoriqueManager);