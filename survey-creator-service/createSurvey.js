// Function to transform external form data into the required survey format for the external survey platform
function createSurvey(externalFormData) {
    const survey = {
      name: externalFormData.form_name || "Generated Survey",
      description: "A survey to gather feedback on Ushahidi tools.",
      base_language: "en-US",
      require_approval: true,
      everyone_can_create: true,
      translations: {},
      tasks: [],
      enabled_languages: {
          default: "en-US",
          available: []
      },
    };
  
    // Iterate through the form data to create survey fields
    const fields = [];
    
    Object.keys(externalFormData).forEach(key => {
      const value = externalFormData[key];
      // Handle different types of form fields (radio, text, number, etc.)
      if (key.includes('radio')) {
        // radio 
        const options = key.match(/\[(.*?)\]/)[1].split(',').map(opt => opt.trim());
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select an option",
          input: "radio",
          type: "varchar",
          required: false,
          priority: 0,
          options: options,
          cardinality: 1,   
          translations:{},
          
        });
      } else if (key.includes('short text')) {
        //  short text 
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Enter your full name",
          input: "text",
          type: "varchar",
          required: true,
          priority: 1,
          cardinality: 1,
          translations:{},
        });
      } else if (key.includes('long text')) {
        // long text 
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Enter your detailed response",
          input: "textarea",
          type: "text",
          required: true,
          priority: 2,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('select')) {
        // select
        const options = key.match(/\[(.*?)\]/)[1].split(',').filter(opt => opt.trim()).map(opt => opt.trim());
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select an option",
          input: "select",
          type: "varchar",
          required: false,
          priority: 3,
          options: options,
          cardinality: 1,
          
          translations:{},
          
        });
      }else if (key.includes('number (decimal)')){
    
     // decimal
     fields.push({
        label: value.split(' - ')[0].trim(),
        instructions: "Enter a decimal number",
        input: "number",
        type: "decimal",
        required: true,
        priority: 4,
        
        cardinality: 1,
        
        translations:{},
        
      });

    } else if (key.includes('number (int)')) {
        // integer
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Enter an integer number",
          input: "number",
          type: "int",
          required: true,
          priority: 5,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('date')) {
        // date
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select a date",
          input: "date",
          type: "datetime",
          required: true,
          priority: 6,
          
          cardinality: 1,
          config: [],
          
          
        });
      } else if (key.includes('datetime')) {
        // datetime
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select a date and time",
          input: "datetime",
          type: "datetime",
          required: true,
          priority: 7,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('location')) {
        // location
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select a location",
          input: "location",
          type: "point",
          required: true,
          priority: 8,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('checkbox')) {
        // checkbox
        const options = key.match(/\[(.*?)\]/)[1].split(',').filter(opt => opt.trim()).map(opt => opt.trim());
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Select one or more options",
          input: "checkbox",
          type: "varchar",
          required: false,
          priority: 9,
          options: options,
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('image')) {
        // image
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Upload an image",
          input: "upload",
          type: "media",
          required: false,
          priority: 10,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('video')) {
        // video
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Embed a video link",
          input: "video",
          type: "varchar",
          required: false,
          priority: 11,
          
          cardinality: 1,
          
          translations:{},
          
        });
      } else if (key.includes('markdown')) {
        // markdown
        fields.push({
          label: value.split(' - ')[0].trim(),
          instructions: "Provide markdown content",
          input: "markdown",
          type: "markdown",
          required: false,
          priority: 12,
          
          cardinality: 1,
          
          translations:{},
          
        });
      }
          
        });
      
   
  

  const task = {
    priority: 0,
    required: false,
    label: "Post",
    type: "post",
    show_when_published: true,
    task_is_internal_only: false,
    translations: {},
    fields: fields,
    is_public : true
  };

  
  survey.tasks.push(task);

  return survey;
}

module.exports = { createSurvey };
