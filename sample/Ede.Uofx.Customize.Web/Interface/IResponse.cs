namespace Ede.Uofx.Customize.Web.Interface
{
    public interface IResponse
    {

    }
    public interface IBadResponse
    {
        object Errors { get; set; }


        string Type { get; set; }
    }

    public interface ISingleResponse<TModel> : IResponse
    {
        TModel Model { get; set; }
    }

    public interface IListResponse<TModel> : IResponse
    {
        IEnumerable<TModel> Model { get; set; }
    }

    public class Response : IResponse
    {

    }


    public class BadResponse : IBadResponse
    {
        public string Type { get; set; }

        public object Errors { get; set; }

    }


    public class SingleResponse<TModel> : Response, ISingleResponse<TModel>
    {
        public TModel Model { get; set; }
    }


    public class ListResponse<TModel> : Response, IListResponse<TModel>
    {
        public IEnumerable<TModel> Model { get; set; }
    }
}
