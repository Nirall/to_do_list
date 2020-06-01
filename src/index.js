import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scr: '',
            tasks: props.tasks,
            navbar: props.navbar,
            addTask: false,
            input: '',
            completeTasks: [],            
        }
        this.handleNavBut = this.handleNavBut.bind(this);
        this.handleAddBut = this.handleAddBut.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleCompleteBut = this.handleCompleteBut.bind(this);
        this.handleRestoreBut = this.handleRestoreBut.bind(this);        
    }

    handleNavBut(id, event) {
        this.setState((state) => {
            let navbar = state.navbar;                
            navbar.map(navbut => {                    
                return navbut.active = navbut.id === id ? true : false; 
            })
            return {navbar: navbar};
        })        
    }

    handleCompleteBut(task, event) {        
        this.setState((state) => {
            let tasks = state.tasks;
            tasks = tasks.filter(item => item !== task);            
            let completeTasks = state.completeTasks;            
            completeTasks.push(task);
            if(completeTasks.length > 10) {
                completeTasks = completeTasks.slice(1,);
            }           
            return {tasks: tasks, completeTasks: completeTasks};
        })        
    }

    handleRestoreBut(task, event) {        
        this.setState((state) => {
            let tasks = state.tasks;
            //tasks = tasks.filter(item => item !== task);            
            let completeTasks = state.completeTasks;            
            tasks.push(completeTasks.pop());            
            return {tasks: tasks, completeTasks: completeTasks};
        })        
    }

    handleOnChange(event) {
        this.setState({input: event.target.value});
    }

    handleAddBut(event) {
        if(this.state.addTask === false) {
            this.setState({addTask: true})
        } else {
            this.setState((state) => {
                let tasks = state.tasks;
                if(state.input) {
                    tasks.push(state.input);
                }                               
                return {addTask: false, tasks: tasks, input: ''}
            })
        }               
    }   

    render() {
        const tabActive = this.state.navbar.filter(navbut => navbut.active)[0].id;
        let cardDate = {tasks: null, handleTaskBut: null, buttonText: null};        
        switch(tabActive) {
            case 'TASKS':
                cardDate = {tasks: this.state.tasks, handleTaskBut: this.handleCompleteBut, buttonText: 'COMPLETE'};
                break;
            case 'COMPLETED':
                cardDate = {tasks: this.state.completeTasks, handleTaskBut: this.handleRestoreBut, buttonText: 'RESTORE'};
                break;
            case 'ABOUT':
                cardDate = {tasks: this.props.about, handleTaskBut: null, buttonText: '', about: true};
                break;
            default:
                cardDate = {tasks: this.state.tasks, handleTaskBut: this.handleCompleteBut, buttonText: 'COMPLETE'};            
    }

        return (
            <>
                <Header navbar = {this.state.navbar} onClick = {this.handleNavBut}/>
                <MainSrc tasks = {cardDate.tasks} handleTaskBut = {cardDate.handleTaskBut} buttonText = {cardDate.buttonText} about = {cardDate.about ? cardDate.about: null}/>
                {this.state.addTask ? <TaskForm onChange = {this.handleOnChange} value = {this.state.input}/> : null}
                {tabActive === 'TASKS' ? <AddTaskBut onClick = {this.handleAddBut}/> : null}
            </>
        )
    }    
}

function Header(props) {    
    return (
        <header>
            <div className = "header">
                <img className = "logo" alt = '' src = "./public/Logo.svg" height="70px" />
            </div>
            <div className = "navbar">                
                {props.navbar.map(nav => <NavBut key = {nav.id} task = {nav} onClick = {props.onClick}/>)}
            </div>      
        </header>
    )
}

function NavBut(props) {    
    let className = props.task.active === true ? "navBut _active" : "navBut";
    let imgSrc = props.task.imgSrc;
    if (props.task.active === true) {
        imgSrc = imgSrc.replace('.svg', '_active.svg');        
    }
    return (
        <div className = {className} id = {props.task.id} onClick = {props.onClick.bind(this, props.task.id)}>
            <img className = "navIcon" alt="" src = {imgSrc} height="30px" />
            <span className = 'navText'>{props.task.id}</span> 
        </div>
    )
}

function MainSrc(props) {       
    const tasksToRender = props.tasks.map((task, index) =>
        <TaskCard key = {task+index} task = {task} handleTaskBut = {props.handleTaskBut} buttonText = {props.buttonText} about = {props.about}/>
    );      
    return (
        <div>                          
            {tasksToRender}
        </div>            
    )    
}

function TaskCard(props) {
    return (
        <div className = 'taskCard'>           
            <div className = "taskText">{props.task}</div>            
            {!props.about ? <button onClick = {props.handleTaskBut.bind(this, props.task)}>{props.buttonText}</button> : null}
        </div>
    )
}

function AddTaskBut(props) {
    return (
        <div className = 'addTaskBut' onClick = {props.onClick}>
            ADD TASK
        </div>
    )
}

function TaskForm(props) {
    return (
        <form>
            <textarea onChange = {props.onChange} value={props.value} />
        </form>
    )
}

const tasks = [
    "First Task",
    "Second Task",
    "Third Task"
]

const navbar = [
    {id: 'TASKS', imgSrc: './public/icon_list.svg', active: true},
    {id: 'COMPLETED', imgSrc: './public/icon_completed.svg', active: false},
    {id: 'ABOUT', imgSrc: './public/icon_about.svg', active: false},
]

const about = ["This apllication created with the tool 'create-react-app'.",  "It's just a training project."];

ReactDOM.render(<App tasks = {tasks} navbar = {navbar} about = {about}/>, document.getElementById('root'));