using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ede.Uofx.Customize.Web.Controllers
{
    [Route("api/emp")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        public EmployeeController()
        {

        }

        [HttpGet("validemp")]   
        public List<string> GetValidEmpNumber()
        {

            return new List<string>() { "A001", "A002" };
        }
    }
}
