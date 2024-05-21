import Logo from '@/assets/logo.svg';
import { userRegister } from '@/services/userService';
import { Link } from '@@/exports';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from 'umi';

/**
 * 用户注册页面
 */
export default () => {
  const navigate = useNavigate();

  /**
   * 用户注册
   * @param fields
   */
  const doUserRegister = async (fields: UserType.UserRegisterRequest) => {
    const hide = message.loading('注册中');
    try {
      await userRegister({ ...fields });
      hide();
      message.success('注册成功');
      navigate('/user/login', {
        replace: true,
      });
    } catch (e) {
      hide();
      message.error('注册失败，请重试！');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        background:
          'url(https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png)',
        backgroundSize: '100% 100%',
      }}
    >
      <LoginForm<UserType.UserRegisterRequest>
        logo={Logo}
        title="寻爱"
        subTitle="发现你的另一半"
        submitter={{
          searchConfig: {
            submitText: '注册',
          },
        }}
        onFinish={async (formData) => {
          await doUserRegister(formData);
        }}
      >
        <>
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入账号'}
            rules={[
              {
                required: true,
                message: '请输入账号!',
              },
            ]}
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <ProFormText.Password
            name="checkPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入确认密码'}
            rules={[
              {
                required: true,
                message: '请输入确认密码！',
              },
            ]}
          />
        </>
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <Link to="/user/login">老用户登录</Link>
        </div>
      </LoginForm>
    </div>
  );
};
