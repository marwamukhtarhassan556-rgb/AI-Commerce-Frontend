namespace AI_Sales_Agent.Domain
{
    public class Plan : BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string PlanName { get; set; } = string.Empty;
        
        // رجعنا الخاصية دي عشان الـ Handlers يشتغلوا
        public decimal PlanPrice { get; set; } 

        public string PlanDescription { get; set; } = string.Empty;
        public string PlanStatus { get; set; } = string.Empty;

        //Subscription
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

        //Plan Features
        public ICollection<PlanFeature> PlanFeatures { get; set; } = new List<PlanFeature>();
    }
}
