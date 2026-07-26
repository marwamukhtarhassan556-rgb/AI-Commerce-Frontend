using FluentValidation;

namespace AI_Sales_Agent.Features.Stores.UpdateStore
{
    public class UpdateStoreCommandValidator : AbstractValidator<UpdateStoreCommand>
    {
        public UpdateStoreCommandValidator()
        {
            RuleFor(command => command.StoreId).NotEmpty();
            RuleFor(command => command.Name).NotEmpty().MaximumLength(150);
            RuleFor(command => command.Description).MaximumLength(1000);
            RuleFor(command => command.Platform).NotEmpty().MaximumLength(100);
            RuleFor(command => command.ShopDomain).NotEmpty().MaximumLength(250);
            RuleFor(command => command.Status).NotEmpty().MaximumLength(50);
        }
    }
}
