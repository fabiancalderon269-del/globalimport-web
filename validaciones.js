document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

    // Configuraciones de validación (Regex y Reglas)
    const fields = {
        nombre: { validate: value => value.trim().length > 3, msg: "Ingrese su nombre completo (mín. 4 caracteres)." },
        fecha_nacimiento: { validate: value => value !== "", msg: "Seleccione su fecha de nacimiento." },
        rut: { validate: value => /^[0-9.-]{7,12}$/.test(value), msg: "Formato de identificador no válido." },
        genero: { validate: value => value !== "", msg: "Seleccione una opción." },
        nacionalidad: { validate: value => value.trim().length > 2, msg: "Ingrese su nacionalidad." },
        email: { validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), msg: "Correo electrónico no válido." },
        confirm_email: { validate: value => value === document.getElementById('email').value, msg: "Los correos no coinciden." },
        telefono: { validate: value => /^[0-9+\s-]{8,15}$/.test(value), msg: "Número de teléfono no válido." },
        password: { validate: value => value.length >= 8, msg: "Debe tener al menos 8 caracteres." },
        confirm_password: { validate: value => value === document.getElementById('password').value, msg: "Las contraseñas no coinciden." },
        pais: { validate: value => value.trim() !== "", msg: "Campo obligatorio." },
        provincia: { validate: value => value.trim() !== "", msg: "Campo obligatorio." },
        ciudad: { validate: value => value.trim() !== "", msg: "Campo obligatorio." },
        direccion: { validate: value => value.trim() !== "", msg: "Ingrese calle y número." },
        codigo_postal: { validate: value => /^[0-9]{4,8}$/.test(value), msg: "Código postal no válido." },
        terms: { validate: (v, el) => el.checked, msg: "Debe aceptar los términos." }
    };

    /**
     * Aplica estilos visuales de error o éxito al contenedor del campo
     */
    const setFieldStatus = (input, isValid, message = "") => {
        const group = input.closest('.form-group') || input.closest('.terms-group');
        const errorDisplay = group.querySelector('.error-text');

        if (isValid) {
            group.classList.remove('error');
            group.classList.add('success');
            if (errorDisplay) errorDisplay.textContent = "";
        } else {
            group.classList.remove('success');
            group.classList.add('error');
            if (errorDisplay) errorDisplay.textContent = message;
        }
    };

    /**
     * Valida un campo individualmente
     */
    const validateField = (id) => {
        const input = document.getElementById(id);
        if (!fields[id]) return true;
        
        const isValid = fields[id].validate(input.value, input);
        setFieldStatus(input, isValid, fields[id].msg);
        return isValid;
    };

    // --- Validación en Tiempo Real ---
    // Se ejecuta mientras el usuario escribe o sale del campo
    Object.keys(fields).forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        // Validar al perder el foco (blur)
        input.addEventListener('blur', () => validateField(id));

        // Validar mientras escribe (input) para dar feedback inmediato si ya hay error
        input.addEventListener('input', () => {
            const group = input.closest('.form-group') || input.closest('.terms-group');
            if (group.classList.contains('error')) {
                validateField(id);
            }
            
            // Casos especiales de emparejamiento
            if (id === 'email') validateField('confirm_email');
            if (id === 'password') validateField('confirm_password');
        });
    });

    // --- Validación al Enviar (Submit) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validar todos los campos definidos en el objeto 'fields'
        Object.keys(fields).forEach(id => {
            if (!validateField(id)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simulación de procesamiento
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Procesando...";

            setTimeout(() => {
                form.style.display = 'none';
                document.querySelector('.form-header').style.display = 'none';
                successMessage.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        } else {
            // Hacer scroll al primer error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Limpiar estados al resetear
    form.addEventListener('reset', () => {
        document.querySelectorAll('.form-group, .terms-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorDisplay = group.querySelector('.error-text');
            if (errorDisplay) errorDisplay.textContent = "";
        });
    });
});