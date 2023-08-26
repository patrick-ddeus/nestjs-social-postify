import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

describe('AppController unit tests', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
    controller = new AppController(service);
  });

  it("Should return i'm okay!", async () => {
    jest.spyOn(service, 'getHello').mockImplementationOnce(() => "I'm okay!");
    const response = controller.getHello();

    expect(response).toEqual("I'm okay!");
  });
});
