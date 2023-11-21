using AutoMapper;
using Ede.Uofx.Customize.Web.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace Ede.Uofx.Customize.Web.Controllers
{
    [ApiController]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(typeof(IResponse), 400)]
    public abstract class ApiControllerBase : ControllerBase
    {


        #region Properties

        public IMapper Mapper { get; set; }



        #endregion

        #region Protected Methods

        protected string GetRequestHeaderToken()
        {
            var authKey = "Authorization";
            if (HttpContext.Request.Headers.ContainsKey(authKey))
            {
                return ((string)HttpContext.Request.Headers[authKey]).Replace("Bearer ", "");
            }
            return string.Empty;
        }
        protected IActionResult Ok<TModel>(TModel model) => ApiActionResult.Ok(model);

        protected IActionResult NotFound<TModel>() => ApiActionResult.NotFound<TModel>();

        protected IActionResult BadRequest(IEnumerable<string> errors) => ApiActionResult.BadRequest(errors);
        protected IActionResult BadRequest(object errors) => ApiActionResult.BadRequest(errors);

        #endregion
    }
}
