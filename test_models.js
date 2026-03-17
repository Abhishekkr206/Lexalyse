const key = "[ENCRYPTION_KEY]";

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log(data.models.map(m => m.name).filter(n => n.includes('flash')));
    } else {
      console.log(data);
    }
  })
  .catch(console.error);
