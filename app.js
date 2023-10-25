require('colors');
const { guardarDB,leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


const main = async()=>{

    let opt='';
    const tareas = new Tareas();

    const tareasDB= leerDB();

    if(tareasDB){//Cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
        
    do{
        opt= await inquirerMenu();
        
        switch (opt) {
            case '1':
                //Crear opción
                const desc= await leerInput('descripción:');
                tareas.crearTarea(desc);
                break;
            case '2': //listar tareas
                tareas.listadoCompleto();
                break;
            case '3': //Listar completadas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4': //listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5':// completado | pendiente
                const ids= await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6'://Borrar
                const id= await listadoTareasBorrar(tareas.listadoArr);
                if(id!=='0'){
                    const ok= await confirmar('¿Está seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada.');
                    }
                }
                break;
            default:
                break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();

    } while (opt !=='0' );

    // pausa();
}

main();