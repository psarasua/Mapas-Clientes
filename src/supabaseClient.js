import { createClient } from "@supabase/supabase-js"; // Importa la función para crear el cliente de Supabase

// Obtiene la URL del proyecto Supabase desde variables de entorno (seguro y flexible)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Obtiene la clave pública de Supabase desde variables de entorno (nunca exponer claves privadas)
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Crea una instancia única del cliente Supabase para toda la app
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta el cliente para ser reutilizado en cualquier parte de la aplicación
export default supabase;
