function validation ()
{
    var name = document.newalarm.nam.value;
    
    var tone = document.newalarm.tone.value;
    
    var arept = document.newalarm.arpt.value; 
	
  
    if (name == "")
    {
        alert ("you left this blank! please insert name of alarm here.");
    }
    
    if (tone == "")
    {
        alert ("you left this blank! please insert your tone here.");
    }
    
    if (arept == "")
    {
        alert ("you left this blank! please select a day or days here.");
    }
    
}