using System;
using System.Collections.Generic;
using System.Text;
using Ede.Uofx.Customize.Web.Extensions;
using Ede.Uofx.Customize.Web.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Ede.Uofx.Customize.Web.Controllers
{
    public static class ApiActionResult
    {
        public static IActionResult Ok()
        {
            return new Response().ToHttpResponse();
        }


        public static IActionResult Ok<TModel>(TModel model)
        {
            var response = new SingleResponse<TModel> { Model = model };
            return response.ToHttpResponse();
        }


        public static IActionResult Ok<TModel>(IEnumerable<TModel> models)
        {
            var response = new ListResponse<TModel> { Model = models };
            return response.ToHttpResponse();
        }


        public static IActionResult BadRequest(object errors)
        {
            var response = new BadResponse
            {
                Type = "DidBadRequest",
                Errors = errors,
            };
            return response.ToBadHttpResponse();
        }


        public static IActionResult NotFound<TModel>()
        {
            var response = new SingleResponse<TModel>();
            return response.ToHttpResponse();
        }


        public static IActionResult NotFound()
        {
            var response = new Response();
            return response.ToHttpResponse();
        }
    }
}
