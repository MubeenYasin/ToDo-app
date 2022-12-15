import { useEffect, useState } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../config/firebase'
import { TodoType } from "../../types/TodosTypes"
import { async } from "@firebase/util";

const Todos = () => {

    const [todos, setTodos] = useState<TodoType[]>([])
    const [description, setDescription] = useState<string>('')
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        console.log("Todos component just render");
        getTodosHandler()

    }, [])

    // useEffect(()=>{
    //     console.log("Todos component just render");

    // },[props.data, props.input])


    const getTodosHandler = async () => {
        console.log("get todos method");

        try {
            setLoader(true)
            const querySnapshot = await getDocs(collection(db, "todos"));
            let todosList: TodoType[] = []
            querySnapshot.forEach((doc) => {
                todosList.push({
                    description: doc.data()?.description,
                    id: doc.id,
                    createdAt: doc.data()?.createdAt
                });
            });

            console.log('todos', todosList);
            setTodos(todosList)

        } catch (error) {
            console.log('================catch====================');
            console.log(error);
            console.log('====================================');
        }
        finally{
            setLoader(false)
        }
    }

    const onTodoSubmitHandler = async () => {
        const newDoc = {
            description,
            createdAt: new Date()
        }

        try {
            const docRef = await addDoc(collection(db, "todos"), newDoc);
            console.log("Document written with ID: ", docRef.id);

            setTodos([...todos, { ...newDoc, id: docRef.id }])
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <div>
            <h1>Add new todo</h1>
            {/* <label htmlFor="description">Enter description</label> */}
            <input type="text" placeholder="Please Type" onChange={(e) => setDescription(e.target.value)} />

            <button onClick={onTodoSubmitHandler}>Submit</button>

            <h1>
                List of Todos from firestore db
            </h1>

            <button onClick={getTodosHandler}>get todos</button>
            {loader && <h1>Loading.....</h1>}
            {todos.map((todo: TodoType, index: number) => {
                return (
                    <div key={index}>{todo.id}  - {todo.description}</div>
                )
            })}

        </div>
    )
}
export default Todos