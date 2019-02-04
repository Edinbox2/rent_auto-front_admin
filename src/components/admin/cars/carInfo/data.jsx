export const data = [
  
    {
        id:"name", 
    },
    {
        id:"brand", 
    },  
    {
        id:"style", 
    },
    {
        id:"model_class", 
    }, 
    {
        id:"rental", 
    },
    {
        id:"engine_volume", 
    },  
    {
        id:"note", 
    },

] 

export const formdata = {
    name: {
        value: "",
        element: "input",
        config: {
          name: "model_name",
          type: "text",
          label: "Model name"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      style: {
        value: "",
        element: "input",
        config: {
          name: "style",
          type: "text",
          label: "Style"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      brand: {
        value: "",
        element: "select",
        config: {
          name: "brand",
          label: "Brand"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      model_class: {
        value: "",
        element: "input",
        config: {
          name: "car_class",
          type: "text",
          label: "Model class"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      rental: {
        value: "",
        element: "input",
        config: {
          name: "Price",
          type: "number",
          label: "Base price"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      engine_volume: {
        value: "",
        element: "input",
        config: {
          name: "engine_volume",
          type: "number",
          label: "Engine volume"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showLabel: true
      },
      note: {
        value: "",
        element: "textarea",
        config: {
          name: "note",
          type: "text",
          label: "Description"
        },
        validation: {
          required: false
        },
        valid: true,
        validationMessage: "",
        showLabel: true
      }
}