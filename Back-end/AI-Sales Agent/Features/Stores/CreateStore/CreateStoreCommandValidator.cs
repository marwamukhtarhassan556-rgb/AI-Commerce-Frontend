using FluentValidation;

namespace AI_Sales_Agent.Features.Stores.CreateStore
{
    public class CreateStoreCommandValidator : AbstractValidator<CreateStoreCommand>
    {
        public CreateStoreCommandValidator()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(150);
            RuleFor(command => command.Description).MaximumLength(1000);
            RuleFor(command => command.Platform).NotEmpty().MaximumLength(100);
            RuleFor(command => command.ShopDomain).NotEmpty().MaximumLength(250);
            RuleFor(command => command.Currency).NotEmpty().MaximumLength(10);
            RuleFor(command => command.Language).NotEmpty().MaximumLength(20);
            RuleFor(command => command.Timezone).NotEmpty().MaximumLength(100);
        }
    }
}
